# 🛡️ Web Security Challenges

A collection of custom-built web security Capture the Flag challenges designed to simulate real-world attack surfaces and sharpen offensive web security skills. Each challenge covers a distinct vulnerability class and includes everything needed to understand, exploit, and learn from it.

---

## 📁 Repository Structure

Each challenge lives in its own self-contained directory:

```
Web-Security-Challenges/
├── challenge-name/
│   ├── challenge/        			# Challenge source code (vulnerable application)
│   ├── writeup.md        			# Detailed writeup — vulnerability, methodology, exploitation
│   ├── resolver/         			# Automated exploit / solver script
│   └── challenge/deploy.sh         # Shell script to deploy the challenge locally
```

---

## 📚 What's Inside Each Challenge

| File | Description |
|---|---|
| `challenge/` | The vulnerable application code to attack |
| `writeup.md` | Step-by-step breakdown of the vulnerability and exploitation approach |
| `resolver/` | A working exploit or solver script that captures the flag |
| `deploy.sh` | A shell script to deploy the challenge application locally |

---

## 🎯 Vulnerability Categories

Challenges span a range of real-world web vulnerability classes including:

- SQL Injection
- Cross-Site Scripting (XSS)
- Authentication Bypass
- Insecure Direct Object Reference (IDOR)
- Server-Side Request Forgery (SSRF)
- Command Injection
- Broken Access Control
- Business Logic Flaws

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone git@github.com:ItsAbderrahimEl/Web-Security-Challenges.git
cd Web-Security-Challenges
```

Navigate to any challenge directory and run the deploy script to spin up the vulnerable application:

```bash
cd challenge-name
chmod +x deploy.sh
./deploy.sh
```

Then read `writeup.md` to understand the vulnerability and run the resolver to see the exploitation in action.

---

## ✍️ Author

**Abderrahim El Ouariachi**  
Penetration Tester & Laravel Developer  
[GitHub](https://github.com/ItsAbderrahimEl)