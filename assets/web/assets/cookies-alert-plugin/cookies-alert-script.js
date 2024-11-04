(function () {
    document.addEventListener('DOMContentLoaded', () => {
        var tmpInput = document.querySelector('input[name=cookieData]');

        let loader = document.createElement('div');
        loader.innerHTML = `
        <style>
            .spinner {
                animation: rotate 2s linear infinite;
                z-index: 2;
                position: absolute;
                top: 50%;
                left: 50%;
                margin: -25px 0 0 -25px;
                width: 50px;
                height: 50px;
            }
            
            .path {
                stroke: ${tmpInput.getAttribute('data-cookie-colorButton')};
                stroke-linecap: round;
                animation: dash 1.5s ease-in-out infinite;
            }
            
            @keyframes rotate {
                100% {
                    transform: rotate(360deg);
                }
            }
            
            @keyframes dash {
                0% {
                    stroke-dasharray: 1, 150;
                    stroke-dashoffset: 0;
                }
                50% {
                    stroke-dasharray: 90, 150;
                    stroke-dashoffset: -35;
                }
                100% {
                    stroke-dasharray: 90, 150;
                    stroke-dashoffset: -124;
                }
            }          
        </style>
        <svg class="spinner" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>`;

        var getCookie = function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        };
        
        let overlayBg = document.createElement('div');
        function showOverlay() {
            overlayBg.style.top = 0;
            overlayBg.style.left = 0;
            overlayBg.style.position = 'fixed';
            overlayBg.style.display = 'block';
            overlayBg.style.background = '#000000';
            overlayBg.style.opacity = tmpInput.getAttribute('data-cookie-opacityOverlay')*0.01;
            overlayBg.style.height = '100%';
            overlayBg.style.width = '100%';
            overlayBg.style.zIndex = '1050';

            document.body.appendChild(overlayBg);
        }
        function removeOverlay() {
            overlayBg.remove();
        }

        let loaderBg = document.createElement('div');

        function showLoader() {
            loaderBg.style.top = 0;
            loaderBg.style.left = 0;
            loaderBg.style.position = 'fixed';
            loaderBg.style.display = 'block';
            loaderBg.style.background = '#ffffff';
            loaderBg.style.height = '100%';
            loaderBg.style.width = '100%';
            loaderBg.style.zIndex = '9998';

            loaderBg.appendChild(loader);
            document.body.appendChild(loaderBg);
        }
        
        function removeLoader() {
            loaderBg.remove();
        }
        
        if (getCookie('cookiesDirective')) {
            showLoader();
        } else if (tmpInput.getAttribute('data-cookie-cookiesAlertType') === '3' && tmpInput.getAttribute('data-cookie-customDialogSelector')) {
            showOverlay();
        }

        if (cookiesDirective && tmpInput) {
            var changeNoCookie = function() {
                if (cookiesDirective && (tmpInput.getAttribute('data-cookie-cookiesAlertType') === '3' || tmpInput.getAttribute('data-cookie-cookiesAlertType') === '2')) {
                    showLoader();
                    if (overlayBg) overlayBg.remove();
                    const scripts = Array.from(document.querySelectorAll('script'));
    
                    let exception = scripts.find(function(item) {
                        if (!item.getAttribute('data-src')) return;
                        return item.getAttribute('data-src').includes('theme/js/script.js')
                    })
    
                    scripts.push(scripts.splice(scripts.indexOf(exception), 1)[0])
    
                    let promise = Promise.resolve();
    
                    function includeSCript(item) {
                        return new Promise((resolve, reject) => {
                            if (item.getAttribute('data-src')) {
                                let newScript = document.createElement('script');
                                document.body.appendChild(newScript);
                                newScript.onload = function(e) {resolve()};
                                newScript.onerror = function() {resolve()};
                                newScript.src = item.getAttribute('data-src');
                                item.remove();
                            } 
                            else {
                                let newScript = document.createElement('script');
                                document.body.appendChild(newScript);
                                newScript.innerHTML = item.innerHTML;
                                resolve();
                                item.remove();
                            }
    
                        })
                    }
    
                    scripts.forEach(item => {
                        if (item.src || item.type === 'text/javascript') return;
                        promise = promise.then(function() {
                            return includeSCript(item);
                        })
                    });
    
                    promise.then(function() {
                        removeLoader();
                        removeOverlay();
                    })
    
                    const iframes = document.querySelectorAll('iframe');
                    iframes.forEach(item => {
                        if (item.src) return;
                        item.src = item.getAttribute('data-src');
                        item.removeAttribute('data-src');
                    });
    
                    const links = document.querySelectorAll('link')
                    links.forEach(item => {
                        if (item.href) return;
                        item.href = item.getAttribute('data-href');
                        item.removeAttribute('data-href');
                    });
    
                    const anotherObjects = document.querySelectorAll('embed, object, img')
                    anotherObjects.forEach(item => {
                        if (item.src) return;
                        item.src = item.getAttribute('data-src');
                        item.removeAttribute('data-src');
                    })
                } else {
                    removeLoader();
                    removeOverlay();
                };
            }
            new cookiesDirective({
                customDialogSelector: tmpInput.getAttribute('data-cookie-customDialogSelector') === 'null' ? null : tmpInput.getAttribute('data-cookie-customDialogSelector'),
                explicitConsent: tmpInput.getAttribute('data-cookie-cookiesAlertType') === '2' || tmpInput.getAttribute('data-cookie-cookiesAlertType') === '3' ? true : false,
                cookiesAlertType: tmpInput.getAttribute('data-cookie-cookiesAlertType'),
                position: 'bottom',
                duration: 0,
                limit: 0,
                message: tmpInput.getAttribute('data-cookie-text'),
                fontFamily: 'Arial',
                fontColor: tmpInput.getAttribute('data-cookie-colorText'),
                fontSize: '13px',
                backgroundColor: tmpInput.getAttribute('data-cookie-colorBg'),
                bgOpacity: tmpInput.getAttribute('data-cookie-bgOpacity'),
                backgroundOpacity: tmpInput.getAttribute('data-cookie-opacityOverlay'),
                linkColor: tmpInput.getAttribute('data-cookie-colorLink'),
                underlineLink: tmpInput.getAttribute('data-cookie-underlineLink'),
                textButton: tmpInput.getAttribute('data-cookie-textButton'),
                colorButton: tmpInput.getAttribute('data-cookie-colorButton'),
                rejectColor: tmpInput.getAttribute('data-cookie-rejectColor'),
                animate: tmpInput.getAttribute('data-cookie-customDialogSelector') === 'null',
                rejectText: tmpInput.getAttribute('data-cookie-rejectText'),
                scriptWrapper: changeNoCookie
            });
            tmpInput.remove();
        } else {
            removeLoader();
            removeOverlay();
        }
    })
})();
//# sourceMappingURL=cookies-alert-script.js.map
