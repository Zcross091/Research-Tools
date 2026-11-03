import subprocess
import httpx
import sys

sys.stdout.reconfigure(encoding='utf-8')

p = subprocess.Popen(['git', 'credential', 'fill'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
out, _ = p.communicate('protocol=https\nhost=github.com\n')
token = next(line.split('=', 1)[1].strip() for line in out.splitlines() if line.startswith('password='))

headers = {'Authorization': f'Bearer {token}', 'Accept': 'application/vnd.github.v3+json'}
r = httpx.get('https://api.github.com/repos/Zcross091/Research-Tools/actions/runs/41596597697/jobs', headers=headers)
jobs = r.json().get('jobs', [])
for j in jobs:
    jid = j['id']
    name = j['name']
    print(f"\n==================== JOB: {name} ({jid}) ====================")
    r_log = httpx.get(f'https://api.github.com/repos/Zcross091/Research-Tools/actions/jobs/{jid}/logs', headers=headers, follow_redirects=True)
    lines = r_log.text.splitlines()
    for l in lines[-35:]:
        print(l)
