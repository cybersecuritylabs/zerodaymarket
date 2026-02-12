<div align="center">

```
███████╗███████╗██████╗  ██████╗ ██████╗  █████╗ ██╗   ██╗
╚══███╔╝██╔════╝██╔══██╗██╔═══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝
  ███╔╝ █████╗  ██████╔╝██║   ██║██║  ██║███████║ ╚████╔╝ 
 ███╔╝  ██╔══╝  ██╔══██╗██║   ██║██║  ██║██╔══██║  ╚██╔╝  
███████╗███████╗██║  ██║╚██████╔╝██████╔╝██║  ██║   ██║   
╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   
                                                            
███╗   ███╗ █████╗ ██████╗ ██╗  ██╗███████╗████████╗
████╗ ████║██╔══██╗██╔══██╗██║ ██╔╝██╔════╝╚══██╔══╝
██╔████╔██║███████║██████╔╝█████╔╝ █████╗     ██║   
██║╚██╔╝██║██╔══██║██╔══██╗██╔═██╗ ██╔══╝     ██║   
██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██╗███████╗   ██║   
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   
```

<p align="center">
  <img src="https://img.shields.io/badge/Difficulty-Expert-ff0000?style=for-the-badge&logo=target&logoColor=white" />
  <img src="https://img.shields.io/badge/Category-Web_Security-00d9ff?style=for-the-badge&logo=hackaday&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Active-00ff00?style=for-the-badge&logo=statuspage&logoColor=white" />
</p>

<h3> A High-Stakes E-Commerce Security Challenge </h3>

**Welcome to the digital underground's favorite gadget marketplace.**  
This isn't just another shopping site — it's a living, breathing security lab disguised as production infrastructure.

<div align="center">

```diff
! WARNING: ONE CRITICAL VULNERABILITY EXISTS IN THIS APPLICATION
+ Your mission: Find it. Exploit it. Prove it.
- The system will confirm when you've achieved the impossible.
```

</div>

---

##  **THE CHALLENGE**

<table>
<tr>
<td width="60px" align="center">

```
  ╔═══╗
  ║ ? ║
  ╚═══╝
```

</td>
<td>

**Something is fundamentally broken in this marketplace.**

A single, carefully hidden defect lurks beneath the surface of what appears to be a legitimate e-commerce platform. It's not a toy bug. It's not a configuration mistake. It's a real architectural flaw that could exist in production systems worldwide.

</td>
</tr>
</table>

<div align="center">

###  **WHEN YOU FIND IT, THE APP ITSELF WILL TELL YOU.**

A confirmation popup will appear. No guessing. No maybes.  
Either you've exploited the vulnerability... or you haven't.

</div>

---

##  **WHAT YOU'RE WORKING WITH**

<table>
<tr>
<td width="50%" valign="top">

###  **Full E-Commerce Experience**

```
┌─────────────────────────┐
│  ✓ Product Catalog      │
│  ✓ User Registration    │
│  ✓ Shopping Cart        │
│  ✓ Checkout Flow        │
│  ✓ Order History        │
│  ✓ Transaction Records  │
└─────────────────────────┘
```

Browse consumer electronics, add items to your cart, create accounts, and complete purchases through realistic transaction flows.

</td>
<td width="50%" valign="top">

### 💀 **Your Arsenal**

```
┌─────────────────────────┐
│  ⚡ Browser DevTools    │
│  🔍 HTTP Interceptors   │
│  🧠 Critical Thinking   │
│  🎯 Persistence         │
│  💻 Terminal Access     │
└─────────────────────────┘
```

No hints. No handholding. No walkthroughs.  
Just you, the application, and your skills.

</td>
</tr>
</table>

---

##  **DEPLOYMENT**

<details>
<summary><b>📋 Prerequisites</b> (click to expand)</summary>

<br>

| Tool | Purpose | Installation |
|------|---------|--------------|
| ![Git](https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white) | Version control | `apt-get install git` / `brew install git` |
| ![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white) | Containerization | [Get Docker](https://docs.docker.com/get-docker/) |
| ![Docker Compose](https://img.shields.io/badge/-Docker_Compose-2496ED?style=flat-square&logo=docker&logoColor=white) | Multi-container orchestration | Included with Docker Desktop |
| ![Browser](https://img.shields.io/badge/-Modern_Browser-4285F4?style=flat-square&logo=google-chrome&logoColor=white) | Interface | Chrome, Firefox, Edge, Safari |

</details>

### ⚡ **Quick Start**

```bash
# 1️⃣ Clone the repository
git clone https://github.com/cybersecuritylabs/zerodaymarket
cd zerodaymarket

# 2️⃣ Launch the infrastructure
docker-compose up --build -d

# 3️⃣ Navigate to the marketplace
# Open: http://localhost

# 4️⃣ Begin your hunt
# The clock is ticking...
```

<div align="center">

###  **Container Management**

| Command | Action |
|---------|--------|
| `docker-compose stop` | Pause all containers |
| `docker-compose start` | Resume containers |
| `docker-compose down` | Teardown everything |
| `docker-compose logs -f` | Monitor live logs |

</div>

---

##  **RULES OF ENGAGEMENT**

<table>
<tr>
<td width="33%" align="center" valign="top">

###  **SCOPE**

```
┌─────────────┐
│  LOCALHOST  │
│    ONLY     │
└─────────────┘
```

This lab is for **controlled environments** where you have **explicit permission**. Do not deploy this against systems you don't own.

</td>
<td width="33%" align="center" valign="top">

###  **NO SPOILERS**

```
┌─────────────┐
│  DISCOVER   │
│   IT YOURSELF│
└─────────────┘
```

No solutions in this README. No hints in the code comments. No shortcuts. The challenge is **intentionally difficult**.

</td>
<td width="33%" align="center" valign="top">

###  **PROOF**

```
┌─────────────┐
│  THE APP    │
│  CONFIRMS   │
└─────────────┘
```

When you successfully trigger the vulnerability, a **confirmation popup** will appear. That's your proof of concept.

</td>
</tr>
</table>

---


</div>

Still stuck? Good. That means you're **thinking like a defender**.  
Now think like an **attacker**.

---

##  **CONTRIBUTING**

We welcome contributions that improve the **infrastructure**, **deployment**, or **documentation**:

✅ **Accepted Contributions:**
- Docker optimization
- Cross-platform compatibility fixes  
- Documentation improvements
- Infrastructure enhancements

❌ **Rejected Contributions:**
- Solution walkthroughs
- Exploit code or hints
- Vulnerability disclosures in public issues

<div align="center">

**Found an unintentional leak that reveals the solution?**  
Open an issue **without** posting sensitive details publicly.

</div>

---

##  **LICENSE**

```
MIT License — Educational and experimental use only.

This software is provided for learning purposes. By using this
lab, you agree to test only in authorized environments and to
use discovered techniques responsibly.
```


## Screenshot

![image alt](https://github.com/cybersecuritylabs/zerodaymarket/blob/main/image.png?raw=true)

---

<div align="center">

##  **ARE YOU READY?**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Thousands have tried.                          │
│  Hundreds have failed.                          │
│  Will you be the one to break it?               │
│                                                 │
│  ▶ docker-compose up --build -d                 │
│                                                 │
│  The marketplace awaits.                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

<br>

GOOD LUCK, HUNTER 

<br>

---

<sub>Star ⭐ this repo if you crack it</sub>

</div>
