/* Cookies Directive - The rewrite. Now a jQuery plugin
 * Version: 2.1.0
 * Author: Ollie Phillips
 * 24 October 2013

 Modified by Mobirise
 */

let defaultSettings = {
	explicitConsent: true,
	position: 'top',
	duration: 10,
	limit: 0,
	message: null,
	cookieScripts: null,
	privacyPolicyUri: 'privacy.html',
	scriptWrapper: function () { },
	customDialogSelector: null,
	// Styling
	fontFamily: 'helvetica',
	fontColor: '#FFFFFF',
	fontSize: '13px',
	backgroundColor: '#000000',
	bgOpacity: 100,
	linkColor: '#CA0000',
	underlineLink: true,
	textButton: null,
	rejectText: null,
	colorButton: '',
	positionOffset: '0',
	animate: true,
	callback: function () { },
}

class cookiesDirective {
	constructor(options) {
		// Default Cookies Directive Settings

		let settings = Object.assign({}, defaultSettings, options);

		checkConsentAndExecute(settings);
	}
}

if (typeof $ !== 'undefined') {
	$.cookiesDirective = function(options) {
		// Default Cookies Directive Settings
		var settings = $.extend(defaultSettings, options);
		
		checkConsentAndExecute(settings);
	}
	// Used to load external javascript files into the DOM
	$.cookiesDirective.loadScript = function(options) {
		var settings = $.extend({
			uri: 		'',
			appendTo: 	'body'
		}, options);

		var elementId = String(settings.appendTo);
		var sA = document.createElement("script");
		sA.src = settings.uri;
		sA.type = "text/javascript";
		sA.onload = sA.onreadystatechange = function() {
			if ((!sA.readyState || sA.readyState == "loaded" || sA.readyState == "complete")) {
				return;
			}
		};
		switch(settings.appendTo) {
			case 'head':
				$('head').append(sA);
			  	break;
			case 'body':
				$('body').append(sA);
			  	break;
			default:
				$('#' + elementId).append(sA);
		}
	};
};

function invertHex(hex) {
	hex = hex.slice(1);

	var r = parseInt(hex.slice(0, 2), 16),
	g = parseInt(hex.slice(2, 4), 16),
	b = parseInt(hex.slice(4, 6), 16);

	return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
}


// Helper scripts

// Perform consent checks
var checkConsentAndExecute = function (settings) {
	if (!getCookie('cookiesDirective')) {
		if (settings.limit > 0) {
			// Display limit in force, record the view
			if (!getCookie('cookiesDisclosureCount')) {
				setCookie('cookiesDisclosureCount', 1, 1);
			} else {
				var disclosureCount = getCookie('cookiesDisclosureCount');
				disclosureCount++;
				setCookie('cookiesDisclosureCount', disclosureCount, 1);
			}

			// Have we reached the display limit, if not make disclosure
			if (settings.limit >= getCookie('cookiesDisclosureCount')) {
				disclosure(settings);
			}
		} else {
			// No display limit
			disclosure(settings);
		}

		// If we don't require explicit consent, load up our script wrapping function
		if (!settings.explicitConsent) {
			settings.scriptWrapper();
		} else {
			document.getElementById('explicitsubmit').addEventListener('click', ()=>{
				settings.scriptWrapper();
			})
		}
	} else {
		// Cookies accepted, load script wrapping function
		settings.scriptWrapper();
	}
}

// Get cookie
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

// Set cookie
var setCookie = function(name,value,days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toGMTString();
	}
	document.cookie = name+"="+value+expires+"; path=/";
};

// Detect IE < 9
var checkIE = function(){
	var version;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
		if (re.exec(ua) !== null) {
			version = parseFloat(RegExp.$1);
		}
		if (version <= 8.0) {
			return true;
		} else {
			if(version == 9.0) {
				if(document.compatMode == "BackCompat") {
					// IE9 in quirks mode won't run the script properly, set to emulate IE8
					var mA = document.createElement("meta");
					mA.content = "IE=EmulateIE8";
					document.getElementsByTagName('head')[0].appendChild(mA);
					return true;
				} else {
					return false;
				}
			}
			return false;
		}
	} else {
		return false;
	}
};

// Disclosure routines
var disclosure = function(options) {
	var settings = options;
	settings.css = 'fixed';

	// IE 9 and lower has issues with position:fixed, either out the box or in compatibility mode - fix that
	if(checkIE()) {
		settings.position = 'top';
		settings.css = 'absolute';
	}

	// Any cookie setting scripts to disclose
	var scriptsDisclosure = '';
	if (settings.cookieScripts) {
		var scripts = settings.cookieScripts.split(',');
		var scriptsCount = scripts.length;
		var scriptDisclosureTxt = '';
		if(scriptsCount>1) {
			for(var t=0; t < scriptsCount - 1; t++) {
					scriptDisclosureTxt += scripts[t] + ', ';
			}
			scriptsDisclosure = ' We use ' +  scriptDisclosureTxt.substring(0,  scriptDisclosureTxt.length - 2) + ' and ' + scripts[scriptsCount - 1] + ' scripts, which all set cookies. ';
		} else {
			scriptsDisclosure = ' We use a ' + scripts[0] + ' script which sets cookies.';
		}
	}

	// Create overlay, vary the disclosure based on explicit/implied consent
	// Set our disclosure/message if one not supplied
	if (!settings.customDialogSelector) {

		// Remove the "cookiesdirective" dialog if it already exists in the HTML.
		if (document.querySelector('#cookiesdirective'))
			document.querySelector('#cookiesdirective').remove();

		let html = document.createElement('div');
		html.setAttribute('id', 'epd');

		let cookiesDirectiveEl = document.createElement('div');
		cookiesDirectiveEl.setAttribute('id', 'cookiesdirective');

		var re = /(rgba?)\(([0-9]+),\s+([0-9]+),\s+([0-9]+)(,\s+(\d?\.?\d+))?\)/;
		var currentColor = settings.backgroundColor || 'rgb(255,255,255)'
		var subst = 'rgba($2,$3,$4,' + (settings.bgOpacity || 100) * 0.01 + ')'
		
		cookiesDirectiveEl.setAttribute('style', 'font-family:sans-serif;position:'+ settings.css +';'+ settings.position + ':-300px;left:0px;width:100%;height:auto;background:' + currentColor.replace(re, subst) + ';color:' + settings.fontColor + ';text-align:center;z-index:1050;');

		let cookieWrapperEl = document.createElement('div');
		cookieWrapperEl.classList.add('cookie-wrapper');
		cookieWrapperEl.setAttribute('style', 'position:relative;height:auto;width:90%;padding:10px;margin-left:auto;margin-right:auto;');

		let mbrText = document.createElement('div');
		mbrText.classList.add('mbr-text');

		let para = document.createElement('p');
		para.classList.add('display-7');
		para.classList.add('alert-message');
		para.style.margin = '1rem 0';

		if(!settings.message) {
			if(settings.explicitConsent) {
				// Explicit consent message
				settings.message = 'This site uses cookies. Some of the cookies we ';
				settings.message += 'use are essential for parts of the site to operate and have already been set.';
			} else {
				// Implied consent message
				settings.message = 'We have placed cookies on your computer to help make this website better.';
			}
		}

		para.innerHTML = settings.message;

		// Build the rest of the disclosure for implied and explicit consent
		if (settings.explicitConsent) {
			// Explicit consent disclosure
			let disclosureEl = document.createTextNode(scriptsDisclosure);
			para.appendChild(disclosureEl);

			let epdnotickEl = document.createElement('div');
			epdnotickEl.setAttribute('id', 'epdnotick');
			epdnotickEl.setAttribute('style', 'color:#ca0000;display:none;margin:2px;');

			let accept = document.createElement('div');
			accept.classList.add('accept')
			accept.setAttribute('style', 'display:flex;justify-content:center;align-items:center;margin-bottom:1rem;');

			if (settings.cookiesAlertType === '2')  {
				let rejectInput = document.createElement('a');
				rejectInput.id = 'explicitreject';
				rejectInput.innerText = settings.rejectText || 'Reject';
				rejectInput.classList.add('btn')
				rejectInput.classList.add('btn-white')
				rejectInput.classList.add('display-7')
				rejectInput.setAttribute('style', 'margin:0 5px;' + (settings.rejectColor ? ' background-color:' + settings.rejectColor + ' !important;color:' + invertHex(settings.rejectColor) + '!important;' : '') + 'border-color:' + settings.rejectColor + ' !important;' + 'border:0px solid; padding:5px 20px; border-radius:2px; cursor: pointer;box-shadow: 0 2px 2px 0 rgb(0 0 0 / 20%);');
				
				accept.appendChild(rejectInput);
			}

			// accept
			let submitInput = document.createElement('a');
			submitInput.id = 'explicitsubmit';
			submitInput.innerText = settings.textButton || 'Continue';
			submitInput.classList.add('btn')
			submitInput.classList.add('btn-primary')
			submitInput.classList.add('display-7')
			submitInput.setAttribute('style', 'margin:0 5px;' + (settings.colorButton ? ' background-color:' + settings.colorButton + ' !important;color:' + invertHex(settings.colorButton) + '!important;' : '') + 'border-color:' + settings.colorButton + ' !important;' + 'border:0px solid; padding:5px 20px; border-radius:2px; cursor: pointer;box-shadow: 0 2px 2px 0 rgb(0 0 0 / 20%);');
			accept.appendChild(submitInput);


			mbrText.appendChild(para);
			mbrText.appendChild(accept);
			mbrText.appendChild(epdnotickEl);
			cookieWrapperEl.appendChild(mbrText);

		} else {
			// Implied consent disclosure
			let disclosureEl = document.createTextNode(scriptsDisclosure);
			para.appendChild(disclosureEl);
			mbrText.appendChild(para);
			let button = document.createElement('div');
			button.classList.add('mbr-section-btn');
			let a = document.createElement('a');
			a.setAttribute('style', 'margin:0;' + (settings.colorButton ? ' background-color:' + settings.colorButton + ' !important;color:' + invertHex(settings.colorButton) + '!important;' : '') + (settings.colorButton && self === top ? 'border-color:' + settings.colorButton + ' !important;' : ''));
			a.id = 'impliedsubmit';
			a.setAttribute('class', 'btn btn-sm btn-primary display-7');
			a.appendChild(document.createTextNode(settings.textButton));
			button.appendChild(a);

			cookieWrapperEl.appendChild(mbrText);
			cookieWrapperEl.appendChild(button);
		}

		cookiesDirectiveEl.appendChild(cookieWrapperEl);
		html.appendChild(cookiesDirectiveEl);

		// Links
		Array.from(html.querySelectorAll('a')).filter(el => !el.classList.contains('btn')).forEach(el => {
			el.setAttribute('style', 'color: ' + settings.linkColor + ';text-decoration:' + (settings.underlineLink === true || settings.underlineLink === 'true' ? 'underline' : 'none') + ';')
		});

		document.body.appendChild(html);
	} else {
		// Get the dialog and "cookiesdirective" div.

		let dialog = document.querySelector('#cookie-dialog');
		if (!dialog) return;

		let cd = dialog.querySelector('#cookiesdirective');
		if (!cd) return;

		let cw = dialog.querySelector('.cookie-wrapper');

		// If explicit consent is required, the appropriate controls are
		// needed for the user to be able to consent. If they are not
		// added by the user (developer), we'll automatically add them
		// here and issue a warning to the console.
		if (settings.explicitConsent) {
			let accept;

			if (!cd.querySelector('#accept')) {
				accept = document.createElement('div');
				accept.id = 'accept'
				accept.style = 'display: flex;justify-content: center;align-items: center;margin-bottom:1rem;'
			}

			if (!accept) return;
			cw.appendChild(accept);

			if (settings.cookiesAlertType === '2')  {
				let rejectInput = document.createElement('a');
				rejectInput.id = 'explicitreject';
				rejectInput.innerText = settings.rejectText || 'Reject';
				rejectInput.classList.add('btn');
				rejectInput.classList.add('btn-white');
				rejectInput.classList.add('display-7');
				rejectInput.setAttribute('style', 'margin:0 5px;' + (settings.rejectColor ? ' background-color:' + settings.rejectColor + ' !important;color:' + invertHex(settings.rejectColor) + '!important;' : '') + 'border-color:' + settings.rejectColor + ' !important;' + 'border:0px solid; padding:5px 20px; border-radius:2px; cursor: pointer;box-shadow: 0 2px 2px 0 rgb(0 0 0 / 20%);');
				
				accept.appendChild(rejectInput);
			}

			if (!cd.querySelector('a#explicitsubmit')) {
				let explicitsubmit = document.createElement('a');
				// explicitsubmit.type = 'submit';
				explicitsubmit.id = 'explicitsubmit';
				explicitsubmit.innerText = settings.textButton || 'Continue';
				explicitsubmit.classList.add('btn');
				explicitsubmit.classList.add('btn-primary');
				explicitsubmit.classList.add('display-7');
				explicitsubmit.setAttribute('style', 'margin:0 5px;' + (settings.colorButton ? ' background-color:' + settings.colorButton + ' !important;color:' + invertHex(settings.colorButton) + '!important;' : '') + 'border-color:' + settings.colorButton + ' !important;' + 'border:0px solid; padding:5px 20px; border-radius:2px; cursor: pointer;box-shadow: 0 2px 2px 0 rgb(0 0 0 / 20%);');
				accept.appendChild(explicitsubmit);
				console.warn('cookiesDirective: Submit button with ID "explicitsubmit" does not exist in custom dialog, so automatically added');
			}

		// However, if implied consent is enough, we'll still need a
		// button for the user to indicate that they do not want to see
		// the message again.
		} else {
			if (!cd.querySelector('a#impliedsubmit')) {
				let impliedsubmit = document.createElement('a');
				// impliedsubmit.type = 'submit';
				impliedsubmit.id = 'impliedsubmit';
				impliedsubmit.value = 'Do not show this message again';
				cd.appendChild(impliedsubmit);
				console.warn('cookiesDirective: Submit button with ID "impliedsubmit" does not exist in custom dialog, so automatically added');
			}
		}

		// Make sure that the custom dialog's message about explicit
		// consent being required, is invisible at the start.

		let epdnotick = dialog.querySelector('#epdnotick');
		if (epdnotick) epdnotick.style.display = 'none';

		// The custom dialog must start invisible. We cannot automatically
		// set it at this point because it will revert to its original
		// state once the cookie acceptance is complete. Instead, we warn
		// the user (developer).
		if (getComputedStyle(dialog, null).display !== 'none') {
			console.error('cookiesDirective: Custom dialog element should have CSS style display: "none".');
		}

		// Dialog starts hidden so that it's not visible in content
		// afterwards, so it has to be explicitly made visible.
		dialog.style.display = 'block';
	}

	// Serve the disclosure, and be smarter about branching
	var dp = settings.position.toLowerCase();
	if(dp != 'top' && dp!= 'bottom') {
		dp = 'top';
	}
	var opts = { in: null, out: null};
	if(dp == 'top') {
		opts.in = {'top': settings.positionOffset};
		opts.out = {'top': '-300px'};
	} else {
		opts.in = {'bottom': settings.positionOffset};
		opts.out = {'bottom': '-300px'};
	}

	// check if this page is privacy.html
	function checkPrivacyPage() {
	if (location.href.search('privacy.html') !== -1) return true
		else return false
	}
	if (checkPrivacyPage()) {
		dialog.remove();
	}

	// Start animation

	let cdEl = document.querySelector('#cookiesdirective');

	let setStyles = (obj) => {
		return cdEl.style[dp] = obj[dp];
	}

	let createKeyFrames = (el, to) => {
		let key = Object.keys(to)[0],
			toValue = to[dp],
			fromValue = toValue == '0' ? '-300px' : '0',
			currentDp = getComputedStyle(el, null)[dp],
			from = { [key]: currentDp ? currentDp : fromValue };
		return [from, to];
	}

	let slideIn = cdEl.animate(createKeyFrames(cdEl, opts.in), {
		duration: settings.animate ? 1000 : 0
	});
	slideIn.onfinish = function() {
		setStyles(opts.in);
		if (settings.explicitConsent) {
			// Explicit, need to check a box and click a button
			let explicitSubmit = document.querySelector('#explicitsubmit');
			let explicitReject = document.querySelector('#explicitreject');
			explicitSubmit.addEventListener('click', () => {
				// Set a cookie to prevent this being displayed again
				setCookie('cookiesDirective', 1, 365);

				if (settings.customDialogSelector) {
					cdEl.remove();
					return;
				}
				// Close the overlay
				let slideOut = cdEl.animate(createKeyFrames(cdEl, opts.out), {
					duration: 1000
				});

				slideOut.onfinish = function() {
					setStyles(opts.out);
					// Remove the elements from the DOM and reload page
					cdEl.remove();
				}
			})
			if (explicitReject) {
				explicitReject.addEventListener('click', () => {
					let slideOut = cdEl.animate(createKeyFrames(cdEl, opts.out), {
						duration: 1000
					});

					slideOut.onfinish = function() {
						setStyles(opts.out);
						// Remove the elements from the DOM and reload page
						cdEl.remove();
					}
				})
			}
		} else {
			// Implied consent, just a button to close it
			let impliedsubmit = document.querySelector('#impliedsubmit');
			impliedsubmit.addEventListener('click', () => {
				// If demo-mode off event
				if (impliedsubmit.matches('[demo]')) return;
				// Set a cookie to prevent this being displayed again
				setCookie('cookiesDirective', 1, 365);
				// Close the overlay
				let slideOut = cdEl.animate(createKeyFrames(cdEl, opts.out), {
					duration: settings.animate ? 1000 : 0
				})
				slideOut.onfinish = function() {
					setStyles(opts.out);
					// Remove the elements from the DOM and reload page);
					cdEl.remove();
				}
			})
		}

		if (settings.duration > 0) {
			// Set a timer to remove the warning after 'settings.duration' seconds
			setTimeout(function(){
				let fadeOut = cdEl.animate([
					{ opacity: '1' },
					{ opacity: '0' }
				],{ duration: 2000 });
				fadeOut.onfinish = function() {
					cdEl.style.opacity = '0';
					cdEl.style[dp] = '-300px';
				}
			}, settings.duration * 1000);
		}

		settings.callback();
	}
};
//# sourceMappingURL=cookies-alert-core.js.map
