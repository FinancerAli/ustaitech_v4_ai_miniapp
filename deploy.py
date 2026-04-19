import paramiko
import os
import time

HOST = '194.163.168.169'
USER = 'root'
PASS = 'Muham2001'
DEPLOY_DIR = '/var/www/ustaitech'
LOCAL_DIR = 'C:/Users/MEGATECH/Desktop/ustaitech_v4_ai-main'

def deploy():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f"Connecting to {HOST}...")
    try:
        client.connect(HOST, username=USER, password=PASS, timeout=15)
        print("Connected! Opening SFTP session...")
        sftp = client.open_sftp()
        
        # 1. Take backups to local machine to be absolutely safe
        print("Backing up bot.db and .env to local machine...")
        try:
            sftp.get(f"{DEPLOY_DIR}/bot.db", f"{LOCAL_DIR}/bot.db.prod.bak")
            print("Locally backed up bot.db")
        except Exception as e:
            print("bot.db not found on server or error:", e)
            
        try:
            sftp.get(f"{DEPLOY_DIR}/.env", f"{LOCAL_DIR}/.env.prod.bak")
            print("Locally backed up .env")
        except Exception as e:
            print(".env not found on server or error:", e)

        # 2. Upload files via SFTP
        print("Uploading files via SFTP...")
        
        def upload_dir(local_path, remote_path):
            try:
                sftp.mkdir(remote_path)
            except IOError:
                pass # Directory exists
            for item in os.listdir(local_path):
                lp = os.path.join(local_path, item)
                rp = f"{remote_path}/{item}"
                if os.path.isfile(lp):
                    sftp.put(lp, rp)
                elif os.path.isdir(lp) and item not in ['.git', 'node_modules', '__pycache__']:
                    upload_dir(lp, rp)

        # Upload frontend dists
        print("Uploading miniapp_frontend/dist...")
        try: sftp.mkdir(f"{DEPLOY_DIR}")
        except: pass
        try: sftp.mkdir(f"{DEPLOY_DIR}/miniapp_frontend")
        except: pass
        upload_dir(f"{LOCAL_DIR}/miniapp_frontend/dist", f"{DEPLOY_DIR}/miniapp_frontend/dist")
        
        print("Uploading admin_frontend/dist...")
        try: sftp.mkdir(f"{DEPLOY_DIR}/admin_frontend")
        except: pass
        upload_dir(f"{LOCAL_DIR}/admin_frontend/dist", f"{DEPLOY_DIR}/admin_frontend/dist")
        
        print("Uploading backend files...")
        upload_dir(f"{LOCAL_DIR}/webapp", f"{DEPLOY_DIR}/webapp")
        upload_dir(f"{LOCAL_DIR}/handlers", f"{DEPLOY_DIR}/handlers")
        upload_dir(f"{LOCAL_DIR}/keyboards", f"{DEPLOY_DIR}/keyboards")
        upload_dir(f"{LOCAL_DIR}/utils", f"{DEPLOY_DIR}/utils")
        
        for f in ['bot.py', 'database.py', 'config.py', 'locales.py', 'requirements.txt', 'start.sh', 'nginx.conf.template', 'ustaitech.service.template']:
            print(f"Uploading {f}...")
            sftp.put(f"{LOCAL_DIR}/{f}", f"{DEPLOY_DIR}/{f}")
            
        # 3. Restore backups on server from local to ensure zero data loss
        print("Restoring critical files...")
        try:
            sftp.put(f"{LOCAL_DIR}/bot.db.prod.bak", f"{DEPLOY_DIR}/bot.db")
        except Exception: pass
        try:
            sftp.put(f"{LOCAL_DIR}/.env.prod.bak", f"{DEPLOY_DIR}/.env")
        except Exception: pass

        sftp.close()
        
        # 4. Run setup commands in ONE session
        print("Executing setup commands on server...")
        setup_script = f"""
        cd {DEPLOY_DIR}
        chmod +x start.sh
        pip3 install -r requirements.txt
        cp nginx.conf.template /etc/nginx/sites-available/ustaitech.conf
        ln -sf /etc/nginx/sites-available/ustaitech.conf /etc/nginx/sites-enabled/
        cp ustaitech.service.template /etc/systemd/system/ustaitech.service
        systemctl daemon-reload
        systemctl restart nginx
        systemctl enable --now ustaitech
        systemctl restart ustaitech
        """
        
        stdin, stdout, stderr = client.exec_command(setup_script)
        print("Server output:")
        print(stdout.read().decode())
        err = stderr.read().decode()
        if err:
            print("Server errors:", err)

        print("Deployment finished successfully!")
        
    except Exception as e:
        print("Deployment Error:", e)
    finally:
        client.close()

if __name__ == '__main__':
    deploy()
