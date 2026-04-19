import paramiko
import sys

def run_ssh_commands():
    host = '194.163.168.169'
    user = 'root'
    password = 'Muham2001'

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password, timeout=10)
        
        commands = [
            "ls -la /root",
            "ls -la /var/www",
            "ls -la /opt",
            "systemctl status | grep -i bot",
            "ps aux | grep bot.py",
            "find /root -name bot.py 2>/dev/null"
        ]
        
        for cmd in commands:
            print(f"\n--- Output for: {cmd} ---")
            stdin, stdout, stderr = client.exec_command(cmd)
            print(stdout.read().decode('utf-8'))
            err = stderr.read().decode('utf-8')
            if err:
                print("ERROR:", err)
                
    except Exception as e:
        print("Failed to connect:", e)
    finally:
        client.close()

if __name__ == '__main__':
    run_ssh_commands()
