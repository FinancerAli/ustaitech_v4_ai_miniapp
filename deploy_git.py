import paramiko
import time
import sys
import os

HOST = "194.163.168.169"
USER = "root"
PASS = "Muham2001"
REMOTE_DIR = "/opt/ustaitech_miniapp"

def run_ssh(client, cmd, timeout=300):
    print(f"\n{'='*60}")
    print(f">> {cmd}")
    print('='*60)
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    for line in iter(stdout.readline, ""):
        sys.stdout.write(line)
    for line in iter(stderr.readline, ""):
        sys.stderr.write(line)

def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    print(f"Connecting to {HOST}...")
    client.connect(HOST, username=USER, password=PASS, timeout=15)
    print("Connected!")
    
    print("\n[1/7] Cloning from GitHub (now Public)...")
    run_ssh(client, f"rm -rf {REMOTE_DIR} && git clone https://github.com/FinancerAli/ustaitech_v4_ai_miniapp.git {REMOTE_DIR}")
    
    print("\n[2/7] Uploading secrets (bot.db & .env)...")
    sftp = client.open_sftp()
    if os.path.exists('bot.db'):
        print("Uploading bot.db...")
        sftp.put('bot.db', f'{REMOTE_DIR}/bot.db')
    if os.path.exists('.env'):
        print("Uploading .env...")
        sftp.put('.env', f'{REMOTE_DIR}/.env')
    sftp.close()
    
    print("\n[3/7] Installing system packages & Python dependencies...")
    run_ssh(client, "apt-get update -qq && apt-get install -y -qq python3 python3-pip python3-venv nginx certbot python3-certbot-nginx nodejs npm 2>&1")
    run_ssh(client, f"cd {REMOTE_DIR} && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt")
    
    print("\n[4/7] Building React Frontend...")
    run_ssh(client, f"cd {REMOTE_DIR}/miniapp_frontend && npm install && npm run build")
    run_ssh(client, f"cd {REMOTE_DIR}/admin_frontend && npm install && npm run build")
    
    print("\n[5/7] Configuring Nginx...")
    nginx_conf = f"""
server {{
    listen 80;
    server_name app.ustaitech.uz;

    root {REMOTE_DIR}/miniapp_frontend/dist;
    index index.html;

    location / {{
        try_files $uri $uri/ /index.html;
    }}

    location /admin {{
        alias {REMOTE_DIR}/admin_frontend/dist;
        try_files $uri $uri/ /admin/index.html;
    }}

    location /api/ {{
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }}
}}
"""
    # Write nginx config using Python string
    sftp = client.open_sftp()
    with sftp.file('/etc/nginx/sites-available/ustaitech', 'w') as f:
        f.write(nginx_conf)
    sftp.close()
    
    run_ssh(client, "ln -sf /etc/nginx/sites-available/ustaitech /etc/nginx/sites-enabled/ustaitech")
    run_ssh(client, "rm -f /etc/nginx/sites-enabled/default")
    run_ssh(client, "nginx -t && systemctl reload nginx")
    
    print("\n[6/7] Setting up Systemd Service...")
    service_conf = f"""[Unit]
Description=UstaiTech Web and Bot Target
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory={REMOTE_DIR}
ExecStart={REMOTE_DIR}/start.sh
Restart=always
RestartSec=5
Environment=PATH={REMOTE_DIR}/venv/bin:/usr/bin

[Install]
WantedBy=multi-user.target
"""
    sftp = client.open_sftp()
    with sftp.file('/etc/systemd/system/ustaitech-api.service', 'w') as f:
        f.write(service_conf)
    sftp.close()
    
    # Executing the full start shell
    run_ssh(client, f"chmod +x {REMOTE_DIR}/start.sh")
    run_ssh(client, "systemctl daemon-reload && systemctl enable ustaitech-api && systemctl restart ustaitech-api")
    time.sleep(3)
    run_ssh(client, "systemctl status ustaitech-api | head -n 15")
    
    print("\n[7/7] Generating SSL Auto-Certificate...")
    run_ssh(client, "certbot --nginx -d app.ustaitech.uz --non-interactive --agree-tos --email admin@ustaitech.uz 2>&1")
    
    print("\n" + "="*60)
    print("DEPLOYMENT COMPLETE! 🚀")
    print("User UI: https://app.ustaitech.uz")
    print("Admin UI: https://app.ustaitech.uz/admin")
    print("="*60)
    
    client.close()

def sftp_open(client, path):
    pass # Dummy context var helper

if __name__ == '__main__':
    main()
