# CTF

یک محیط CTF مبتنی بر Docker با معماری **Central Server / Multiple Agents**.

در این معماری تنها **یک Server مرکزی** وجود دارد و Agentهای مربوط به VPهای مختلف با در اختیار داشتن آدرس IP و پورت سرور، به آن متصل می‌شوند.

هر VP می‌تواند Challengeهای مستقل خودش را داشته باشد، اما ارتباط Agentها با یک Server مرکزی انجام می‌شود.

> **توجه:** Challengeهای موجود در این Repository در حال حاضر صرفاً برای تست عملکرد محیط و Workflow سیستم هستند. این README وارد نحوه‌ی حل Challengeها نمی‌شود.

---

## معماری کلی

معماری پروژه به شکل زیر است:

```text
                         ┌─────────────────────┐
                         │    Central Server    │
                         │                     │
                         │   CTF Server        │
                         │   Web Interface     │
                         └──────────┬──────────┘
                                    │
                     ┌──────────────┼──────────────┐
                     │              │              │
                     │              │              │
                  Agent VP1      Agent VP2      Agent VPN
                     │              │              │
                 ┌───▼───┐      ┌───▼───┐      ┌───▼───┐
                 │  VP1  │      │  VP2  │      │  VP3  │
                 │       │      │       │      │       │
                 │Challenges    │Challenges    │Challenges
                 └───────┘      └───────┘      └───────┘
```

### Server

یک Server مرکزی وظیفه‌ی مدیریت و ارائه‌ی سرویس CTF را بر عهده دارد.

Server می‌تواند روی یک Container یا Host مستقل اجرا شود.

### Agent

هر VP دارای Agent مخصوص خودش است.

Agent با استفاده از آدرس Server مرکزی به آن متصل می‌شود:

```text
Agent → Server IP:Port
```

بنابراین لازم نیست برای هر VP یک Server جداگانه اجرا شود.

### VP

هر VP محیط مخصوص خودش را دارد و می‌تواند شامل موارد زیر باشد:

* Agent
* Challengeها
* فایل‌های Setup
* Checkerها
* Flagها
* تنظیمات اختصاصی VP

---

## ساختار پروژه

```text
.
├── docker-compose.yml
├── Dockerfile
├── LICENSE
├── README.md
│
├── server/
│   └── ...
│
├── vp1/
│   ├── agent
│   ├── challenges/
│   │   ├── challenge1/
│   │   │   ├── challenge.json
│   │   │   ├── checker.sh
│   │   │   ├── flag.sh
│   │   │   └── setup.sh
│   │   └── challenge2/
│   │       ├── challenge.json
│   │       ├── checker.sh
│   │       ├── flag.sh
│   │       └── setup.sh
│   ├── entrypoint.sh
│   └── ...
│
├── vp2/
│   ├── agent
│   ├── challenges/
│   ├── entrypoint.sh
│   └── ...
│
└── vpN/
    ├── agent
    ├── challenges/
    ├── entrypoint.sh
    └── ...
```

> ساختار دقیق فایل‌های `server` و VPها می‌تواند بر اساس پیاده‌سازی پروژه متفاوت باشد.

---

## نحوه‌ی ارتباط

ارتباط بین اجزای سیستم به این شکل است:

```text
                  Server
                    │
              IP + Port
                    │
          ┌─────────┼─────────┐
          │         │         │
          ▼         ▼         ▼
       Agent 1   Agent 2   Agent N
          │         │         │
          ▼         ▼         ▼
         VP1       VP2       VPN
```

هر Agent باید آدرس Server را بداند.

برای مثال:

```text
SERVER_ADDR=192.168.1.100:80
```

در این حالت Agent با Server روی آدرس زیر ارتباط برقرار می‌کند:

```text
192.168.1.100:80
```

IP می‌تواند IP داخلی Docker، IP شبکه‌ی داخلی، IP یک Host یا هر آدرسی باشد که Agent بتواند به آن دسترسی داشته باشد.

---

## اجرای Server

ابتدا Server مرکزی باید اجرا شود.

پس از بالا آمدن Server، آدرس قابل دسترسی آن در اختیار Agentها قرار می‌گیرد.

به‌عنوان مثال:

```text
Server IP: 192.168.1.100
Server Port: 80
```

سپس Agentهای VPهای مختلف می‌توانند به آن متصل شوند.

---

## اجرای Agent

هر VP Agent خودش را دارد.

برای مثال:

```text
vp1/agent
vp2/agent
vp3/agent
```

Agent با استفاده از تنظیمات Server به Server مرکزی متصل می‌شود.

مثال:

```yaml
environment:
  SERVER_ADDR: 192.168.1.100:80
```

در این معماری، `SERVER_ADDR` باید به آدرس Server مرکزی اشاره کند، نه آدرس خود Agent.

---

## اجرای چند VP

برای اجرای چند VP، نیازی به اجرای چند Server نیست.

یک Server مرکزی می‌تواند به Agentهای چند VP سرویس بدهد:

```text
                    ┌──────────────┐
                    │    Server    │
                    │   :80        │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          VP1 Agent     VP2 Agent     VPN Agent
             │             │             │
             ▼             ▼             ▼
          VP1 Env       VP2 Env       VPN Env
```

هر Agent صرفاً باید بتواند به IP و Port مربوط به Server دسترسی داشته باشد.

---

## انتخاب VP

VPها با الگوی زیر مشخص می‌شوند:

```text
vp1/
vp2/
vp3/
...
vpN/
```

هر VP می‌تواند Agent و Challengeهای مخصوص خودش را داشته باشد.

برای مثال:

```text
vp1/
├── agent
└── challenges/

vp2/
├── agent
└── challenges/

vp3/
├── agent
└── challenges/
```

`VP=1` به معنی انتخاب `vp1` است.

برای استفاده از VP دیگر می‌توان مقدار `VP` را تغییر داد.

مثلاً:

```yaml
build:
  args:
    VP: "2"
```

در این حالت فایل‌های مربوط به `vp2` در محیط Agent استفاده می‌شوند.

---

## تنظیمات Server

تنظیمات مربوط به Server و اتصال Agentها از طریق Environment Variableها انجام می‌شود.

نمونه:

```yaml
environment:
  SERVER_ADDR: 192.168.1.100:80
  SERVER_URL: http://192.168.1.100:80/api
```

مهم‌ترین مقدار برای Agent:

```text
SERVER_ADDR
```

است که مشخص می‌کند Agent باید به کدام Server متصل شود.

---

## Challengeها

Challengeهای هر VP در مسیر مربوط به همان VP قرار دارند:

```text
vpN/challenges/
```

ساختار معمول Challenge:

```text
challengeN/
├── challenge.json
├── setup.sh
├── checker.sh
└── flag.sh
```

کاربرد کلی فایل‌ها:

| فایل             | کاربرد                      |
| ---------------- | --------------------------- |
| `challenge.json` | اطلاعات و تنظیمات Challenge |
| `setup.sh`       | آماده‌سازی محیط Challenge   |
| `checker.sh`     | بررسی وضعیت Challenge       |
| `flag.sh`        | منطق مربوط به Flag          |

Challengeهای موجود در Repository صرفاً برای **تست محیط و Workflow سیستم** هستند.

---

## Docker

Docker برای ساده‌سازی راه‌اندازی محیط Agentها و Server استفاده می‌شود.

به‌صورت کلی:

```text
Docker Host
    │
    ├── Server Container
    │
    ├── VP1 Container
    │      └── Agent
    │
    ├── VP2 Container
    │      └── Agent
    │
    └── VPN / VP-N Container
           └── Agent
```

نکته‌ی مهم این است که Containerهای Agent باید بتوانند به Network محل اجرای Server دسترسی داشته باشند.

---

## راه‌اندازی

ابتدا Server مرکزی را اجرا کنید.

پس از اطمینان از در دسترس بودن Server، Agent مربوط به VP موردنظر را اجرا کنید.

روند کلی:

```text
1. اجرای Server
       │
       ▼
2. مشخص‌کردن IP و Port Server
       │
       ▼
3. تنظیم SERVER_ADDR
       │
       ▼
4. اجرای Agent
       │
       ▼
5. اتصال Agent به Server
       │
       ▼
6. آماده‌شدن VP
```

---

## بررسی وضعیت

برای بررسی Containerها:

```bash
docker compose ps
```

برای مشاهده‌ی Logها:

```bash
docker compose logs -f
```

و برای مشاهده‌ی Log یک سرویس خاص:

```bash
docker compose logs -f <service>
```

---

## اضافه‌کردن VP جدید

برای اضافه‌کردن VP جدید، یک پوشه‌ی جدید با الگوی `vpN` ایجاد کنید:

```text
vp4/
├── agent
├── challenges/
├── entrypoint.sh
└── ...
```

سپس Agent این VP را به Server مرکزی متصل کنید.

در این حالت معماری همچنان به شکل زیر باقی می‌ماند:

```text
                 Central Server
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
   VP1 Agent       VP2 Agent        VP4 Agent
       │               │                │
       ▼               ▼                ▼
      VP1             VP2              VP4
```

برای اضافه‌شدن VP جدید نیازی به ایجاد Server جدید نیست.

---

## هدف پروژه

هدف پروژه ایجاد یک زیرساخت CTF با معماری **Centralized Server / Distributed Agents** است.

در این معماری:

* یک Server مرکزی وجود دارد.
* هر VP Agent مخصوص خودش را دارد.
* Agentها با IP و Port مشخص به Server متصل می‌شوند.
* هر VP می‌تواند Challengeهای مستقل خودش را داشته باشد.
* اضافه‌کردن VP جدید بدون ایجاد Server جدید امکان‌پذیر است.
* Docker برای ایزوله‌سازی و ساده‌سازی اجرای اجزای محیط استفاده می‌شود.

به این ترتیب می‌توان تعداد زیادی VP و Agent را در کنار یک Server مرکزی مدیریت کرد.

---

## License

اطلاعات مربوط به License در فایل `LICENSE` قرار دارد.
