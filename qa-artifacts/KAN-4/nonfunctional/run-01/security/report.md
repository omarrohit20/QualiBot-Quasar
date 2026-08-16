# Security Scan Report (OWASP ZAP)

Target: https://opensource-demo.orangehrmlive.com

Scan type: passive (traffic captured from the existing @smoke UI run proxied through ZAP)

Total alerts: 96

| Risk | Count |
|---|---|
| High | 1 |
| Medium | 29 |
| Low | 37 |
| Informational | 29 |

## Issues

### [High] Vulnerable JS Library

- **URL:** https://opensource-demo.orangehrmlive.com/web/dist/js/chunk-vendors.js?v=1783336755185
- **Description:** The identified library appears to be vulnerable.
- **Solution:** Upgrade to the latest version of the affected library.
- **CWE ID:** 1395
- **Confidence:** Medium

### [Medium] Missing Anti-clickjacking Header

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
- **Description:** The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.
- **Solution:** Modern Web browsers support the Content-Security-Policy and X-Frame-Options HTTP headers. Ensure one of them is set on all web pages returned by your site/app.
If you expect the page to be framed only by pages on your server (e.g. it's part of a FRAMESET) then you'll want to use SAMEORIGIN, otherwise if you never expect the page to be framed, you should use DENY. Alternatively consider implementing Content Security Policy's "frame-ancestors" directive.
- **CWE ID:** 1021
- **Confidence:** Medium

### [Medium] CSP: Failure to Define Directive with No Fallback

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
- **Description:** The Content Security Policy fails to define one of the directives that has no fallback. Missing/excluding them is the same as allowing anything.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: Wildcard Directive

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: script-src unsafe-inline

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: style-src unsafe-inline

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: Failure to Define Directive with No Fallback

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate
- **Description:** The Content Security Policy fails to define one of the directives that has no fallback. Missing/excluding them is the same as allowing anything.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: Wildcard Directive

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: script-src unsafe-inline

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: style-src unsafe-inline

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] Missing Anti-clickjacking Header

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index
- **Description:** The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.
- **Solution:** Modern Web browsers support the Content-Security-Policy and X-Frame-Options HTTP headers. Ensure one of them is set on all web pages returned by your site/app.
If you expect the page to be framed only by pages on your server (e.g. it's part of a FRAMESET) then you'll want to use SAMEORIGIN, otherwise if you never expect the page to be framed, you should use DENY. Alternatively consider implementing Content Security Policy's "frame-ancestors" directive.
- **CWE ID:** 1021
- **Confidence:** Medium

### [Medium] CSP: Failure to Define Directive with No Fallback

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index
- **Description:** The Content Security Policy fails to define one of the directives that has no fallback. Missing/excluding them is the same as allowing anything.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: Wildcard Directive

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: script-src unsafe-inline

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: style-src unsafe-inline

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] Missing Anti-clickjacking Header

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee
- **Description:** The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.
- **Solution:** Modern Web browsers support the Content-Security-Policy and X-Frame-Options HTTP headers. Ensure one of them is set on all web pages returned by your site/app.
If you expect the page to be framed only by pages on your server (e.g. it's part of a FRAMESET) then you'll want to use SAMEORIGIN, otherwise if you never expect the page to be framed, you should use DENY. Alternatively consider implementing Content Security Policy's "frame-ancestors" directive.
- **CWE ID:** 1021
- **Confidence:** Medium

### [Medium] Missing Anti-clickjacking Header

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList
- **Description:** The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.
- **Solution:** Modern Web browsers support the Content-Security-Policy and X-Frame-Options HTTP headers. Ensure one of them is set on all web pages returned by your site/app.
If you expect the page to be framed only by pages on your server (e.g. it's part of a FRAMESET) then you'll want to use SAMEORIGIN, otherwise if you never expect the page to be framed, you should use DENY. Alternatively consider implementing Content Security Policy's "frame-ancestors" directive.
- **CWE ID:** 1021
- **Confidence:** Medium

### [Medium] CSP: Failure to Define Directive with No Fallback

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee
- **Description:** The Content Security Policy fails to define one of the directives that has no fallback. Missing/excluding them is the same as allowing anything.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: Failure to Define Directive with No Fallback

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList
- **Description:** The Content Security Policy fails to define one of the directives that has no fallback. Missing/excluding them is the same as allowing anything.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: Wildcard Directive

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: Wildcard Directive

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: script-src unsafe-inline

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: script-src unsafe-inline

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: style-src unsafe-inline

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: style-src unsafe-inline

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] Missing Anti-clickjacking Header

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/196
- **Description:** The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.
- **Solution:** Modern Web browsers support the Content-Security-Policy and X-Frame-Options HTTP headers. Ensure one of them is set on all web pages returned by your site/app.
If you expect the page to be framed only by pages on your server (e.g. it's part of a FRAMESET) then you'll want to use SAMEORIGIN, otherwise if you never expect the page to be framed, you should use DENY. Alternatively consider implementing Content Security Policy's "frame-ancestors" directive.
- **CWE ID:** 1021
- **Confidence:** Medium

### [Medium] CSP: Failure to Define Directive with No Fallback

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/196
- **Description:** The Content Security Policy fails to define one of the directives that has no fallback. Missing/excluding them is the same as allowing anything.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: Wildcard Directive

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/196
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: script-src unsafe-inline

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/196
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Medium] CSP: style-src unsafe-inline

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/196
- **Description:** Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.
- **CWE ID:** 693
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/dist/css/chunk-vendors.css?v=1783336755185
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/dist/css/app.css?v=1783336755185
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/dist/fonts/nunito-sans-v6-latin-ext_latin-regular.woff2
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/dist/fonts/nunito-sans-v6-latin-ext_latin-800.woff2
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/dist/fonts/nunito-sans-v6-latin-ext_latin-600.woff2
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/dist/fonts/bootstrap-icons.woff2
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Big Redirect Detected (Potential Sensitive Information Leak)

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate
- **Description:** The server has responded with a redirect that seems to provide a large response. This may indicate that although the server sent a redirect it also responded with body content (which may include sensitive details, PII, etc.).
- **Solution:** Ensure that no sensitive information is leaked via redirect responses. Redirect responses should have almost no content.
- **CWE ID:** 201
- **Confidence:** Medium

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/dist/js/chunk-vendors.js?v=1783336755185
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/dist/js/app.js?v=1783336755185
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=1&offset=0
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/376
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/376/personal-details
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles?limit=0
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/employment-statuses?limit=0
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/dist/fonts/nunito-sans-v6-latin-ext_latin-700.woff2
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/dist/fonts/nunito-sans-v6-latin-ext_latin-italic.woff2
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/dist/fonts/nunito-sans-v6-latin-ext_latin-300.woff2
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/core/validation/unique?value=0399&entityName=Employee&attributeName=employeeId
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/196
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPhoto/empNumber/7
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/196/screen/personal/attachments?limit=50&offset=0
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/196/custom-fields?screen=personal
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/workweek?model=indexed
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/196/personal-details
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Low] Server Leaks Version Information via "Server" HTTP Response Header Field

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/196
- **Description:** The web/application server is leaking version information via the "Server" HTTP response header. Access to such information may facilitate attackers identifying other vulnerabilities your web/application server is subject to.
- **Solution:** Ensure that your web server, application server, load balancer, etc. is configured to suppress the "Server" header or provide generic details.
- **CWE ID:** 497
- **Confidence:** High

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Modern Web Application

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
- **Description:** The application appears to be a modern web application. If you need to explore it automatically then the Client Spider may well be more effective than the standard one.
- **Solution:** This is an informational alert and so no changes are required.
- **CWE ID:** -1
- **Confidence:** Medium

### [Informational] Session Management Response Identified

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
- **Description:** The given response has been identified as containing a session management token. The 'Other Info' field contains a set of header tokens that can be used in the Header Based Session Management Method. If the request is in a context which has a Session Management Method set to "Auto-Detect" then this rule will change the session management to use the tokens identified.
- **Solution:** This is an informational alert rather than a vulnerability and so there is nothing to fix.
- **CWE ID:** -1
- **Confidence:** Medium

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Authentication Request Identified

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate
- **Description:** The given request has been identified as an authentication request. The 'Other Info' field contains a set of key=value lines which identify any relevant fields. If the request is in a context which has an Authentication Method set to "Auto-Detect" then this rule will change the authentication to match the request identified.
- **Solution:** This is an informational alert rather than a vulnerability and so there is nothing to fix.
- **CWE ID:** -1
- **Confidence:** Low

### [Informational] Session Management Response Identified

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate
- **Description:** The given response has been identified as containing a session management token. The 'Other Info' field contains a set of header tokens that can be used in the Header Based Session Management Method. If the request is in a context which has a Session Management Method set to "Auto-Detect" then this rule will change the session management to use the tokens identified.
- **Solution:** This is an informational alert rather than a vulnerability and so there is nothing to fix.
- **CWE ID:** -1
- **Confidence:** Medium

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Modern Web Application

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index
- **Description:** The application appears to be a modern web application. If you need to explore it automatically then the Client Spider may well be more effective than the standard one.
- **Solution:** This is an informational alert and so no changes are required.
- **CWE ID:** -1
- **Confidence:** Medium

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=1&offset=0
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/376
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/376/personal-details
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles?limit=0
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/employment-statuses?limit=0
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Modern Web Application

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee
- **Description:** The application appears to be a modern web application. If you need to explore it automatically then the Client Spider may well be more effective than the standard one.
- **Solution:** This is an informational alert and so no changes are required.
- **CWE ID:** -1
- **Confidence:** Medium

### [Informational] Modern Web Application

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList
- **Description:** The application appears to be a modern web application. If you need to explore it automatically then the Client Spider may well be more effective than the standard one.
- **Solution:** This is an informational alert and so no changes are required.
- **CWE ID:** -1
- **Confidence:** Medium

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/core/validation/unique?value=0399&entityName=Employee&attributeName=employeeId
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/196
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Modern Web Application

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/196
- **Description:** The application appears to be a modern web application. If you need to explore it automatically then the Client Spider may well be more effective than the standard one.
- **Solution:** This is an informational alert and so no changes are required.
- **CWE ID:** -1
- **Confidence:** Medium

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/196/screen/personal/attachments?limit=50&offset=0
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/196/custom-fields?screen=personal
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/workweek?model=indexed
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/196/personal-details
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

### [Informational] Re-examine Cache-control Directives

- **URL:** https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/196
- **Description:** The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.
- **Solution:** For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".
- **CWE ID:** 525
- **Confidence:** Low

