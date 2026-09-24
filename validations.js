/**
 * stackly. Global Validation & Authentication System
 * Complete validation constraints, regex checks, and dashboard isolation.
 */

// Email regex pattern (RFC 5322 compliant simplified)
const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
// Phone regex pattern (accepts strictly 10 numeric digits)
const phonePattern = /^[0-9]{10}$/;
// Name pattern (letters, spaces, hyphens, periods)
const namePattern = /^[a-zA-ZÀ-ÿ\s'.–-]{2,60}$/;

/**
 * Global Toast Helper
 */
window.showGlobalToast = function(title, message, type = 'info') {
    if (typeof window.showToast === 'function') {
        window.showToast(title, message, type);
        return;
    }
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    const borderCol = type === 'error' ? '#ef4444' : (type === 'success' ? '#16a34a' : '#dc2626');
    toast.style.cssText = `background:#ffffff;border:1.5px solid ${borderCol};color:#0f172a;padding:12px 18px;border-radius:12px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.15);font-size:12px;font-family:'Inter',sans-serif;pointer-events:auto;min-width:240px;max-width:340px;transform:translateY(10px);opacity:0;transition:all 0.3s ease;`;
    toast.innerHTML = `<div style="font-weight:700;margin-bottom:2px;color:${borderCol};">${title}</div><div style="color:#475569;">${message}</div>`;
    container.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    });
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};

/**
 * Validate Newsletter Form (Used sitewide in footers and editorial banners)
 */
window.validateNewsletter = function(event, form) {
    event.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input) return false;
    
    const email = input.value.trim();
    
    if (!email) {
        window.showGlobalToast('Subscription Error', 'Please enter your email address.', 'error');
        input.focus();
        return false;
    }
    
    if (email.length < 5 || email.length > 100 || !emailPattern.test(email)) {
        window.showGlobalToast('Invalid Email', 'Please provide a valid email format (e.g. name@domain.com).', 'error');
        input.focus();
        return false;
    }
    
    // Success feedback
    window.showGlobalToast('Subscribed ✓', 'You have been added to the VIP atelier list for exclusive runway previews.', 'success');
    form.reset();
    return true;
};

/**
 * Validate Contact Form (in contact.html)
 */
window.validateContactForm = function(event) {
    if (event) event.preventDefault();
    
    const nameEl = document.getElementById('contact-name');
    const emailEl = document.getElementById('contact-email');
    const phoneEl = document.getElementById('contact-phone');
    const subjectEl = document.getElementById('contact-subject');
    const messageEl = document.getElementById('contact-message');
    const consentEl = document.getElementById('contact-consent');
    
    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const subject = subjectEl ? subjectEl.value : '';
    const message = messageEl ? messageEl.value.trim() : '';
    const consent = consentEl ? consentEl.checked : false;

    // Helper to mark input status
    const setStatus = (el, isValid) => {
        if (!el) return;
        if (isValid) {
            el.classList.remove('is-invalid');
            el.classList.add('is-valid');
        } else {
            el.classList.remove('is-valid');
            el.classList.add('is-invalid');
        }
    };
    
    // Constraint: Name
    if (!name || name.length < 2 || !namePattern.test(name)) {
        setStatus(nameEl, false);
        window.showGlobalToast('Validation Error', 'Please enter your full name (minimum 2 letters).', 'error');
        if (nameEl) nameEl.focus();
        return false;
    }
    setStatus(nameEl, true);
    
    // Constraint: Email
    if (!email || !emailPattern.test(email) || email.length < 5) {
        setStatus(emailEl, false);
        window.showGlobalToast('Validation Error', 'Please enter a valid email address (e.g. name@domain.com).', 'error');
        if (emailEl) emailEl.focus();
        return false;
    }
    setStatus(emailEl, true);
    
    // Constraint: Phone (optional, but if provided must be strictly 10 digits)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (phone && (!phonePattern.test(cleanPhone) || cleanPhone.length !== 10)) {
        setStatus(phoneEl, false);
        window.showGlobalToast('Validation Error', 'Phone number must be exactly 10 digits (e.g. 9876543210).', 'error');
        if (phoneEl) phoneEl.focus();
        return false;
    }
    if (phoneEl && phone) setStatus(phoneEl, true);
    
    // Constraint: Subject
    if (!subject) {
        setStatus(subjectEl, false);
        window.showGlobalToast('Validation Error', 'Please select an inquiry topic.', 'error');
        if (subjectEl) subjectEl.focus();
        return false;
    }
    setStatus(subjectEl, true);
    
    // Constraint: Message
    if (!message || message.length < 10) {
        setStatus(messageEl, false);
        window.showGlobalToast('Validation Error', 'Your message must be at least 10 characters long.', 'error');
        if (messageEl) messageEl.focus();
        return false;
    }
    if (message.length > 1000) {
        setStatus(messageEl, false);
        window.showGlobalToast('Validation Error', 'Message exceeds the maximum limit of 1000 characters.', 'error');
        if (messageEl) messageEl.focus();
        return false;
    }
    setStatus(messageEl, true);
    
    // Constraint: Privacy Consent
    if (!consent) {
        window.showGlobalToast('Validation Error', 'You must agree to the privacy policy to submit your message.', 'error');
        if (consentEl) consentEl.focus();
        return false;
    }
    
    // Show sending state
    const btn = document.getElementById('contact-submit-btn');
    const originalText = btn ? btn.innerHTML : 'Send Message';
    if (btn) {
        btn.textContent = 'Sending Message…';
        btn.disabled = true;
    }
    
    setTimeout(() => {
        window.showGlobalToast('Message Dispatched ✓', 'Thank you! A senior couture advisor will reply within 24 hours.', 'success');
        const formEl = document.getElementById('contact-form-el');
        if (formEl) {
            formEl.reset();
            formEl.querySelectorAll('.is-valid, .is-invalid').forEach(el => el.classList.remove('is-valid', 'is-invalid'));
        }
        if (btn) {
            btn.innerHTML = 'Message Sent <svg style="display:inline;vertical-align:middle;margin-left:6px" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            setTimeout(() => { 
                btn.innerHTML = originalText; 
                btn.disabled = false; 
            }, 3500);
        }
    }, 1200);
    
    return true;
};

/**
 * Global Luxury Reservation Success Pop-up Modal
 */
window.showReservationSuccessModal = function(data) {
    const existing = document.getElementById('global-reservation-modal');
    if (existing) existing.remove();

    const bookingId = data.bookingRef || ('STK-RES-' + Math.floor(100000 + Math.random() * 900000));
    const name = data.name || 'Valued Patron';
    const service = data.service || 'Private Atelier Consultation';
    const date = data.date || new Date().toISOString().split('T')[0];
    const time = data.time || '11:00 AM';
    const location = data.location || 'Salem Flagship Atelier — MMR Complex, Chinnathirupathi';
    const phone = data.phone || '';

    const modal = document.createElement('div');
    modal.id = 'global-reservation-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,0.8);backdrop-filter:blur(8px);opacity:0;transition:opacity 0.3s cubic-bezier(0.16,1,0.3,1);';
    
    modal.innerHTML = `
        <div style="background:#ffffff;border-radius:24px;max-width:480px;width:100%;overflow:hidden;box-shadow:0 30px 60px -15px rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.1);transform:scale(0.92);transition:transform 0.35s cubic-bezier(0.16,1,0.3,1);font-family:'Inter',system-ui,sans-serif;color:#111827;">
            <!-- Header banner -->
            <div style="background:#0a0a0a;padding:26px 28px;color:#ffffff;position:relative;border-bottom:1px solid rgba(255,255,255,0.08);">
                <div style="font-size:10px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;color:#cc0000;margin-bottom:6px;display:flex;align-items:center;gap:6px;">
                    <span style="width:6px;height:6px;border-radius:50%;background:#cc0000;display:inline-block;"></span>
                    Reservation Confirmed
                </div>
                <div style="font-size:22px;font-weight:800;letter-spacing:-0.02em;text-transform:uppercase;line-height:1.2;">Private Atelier Fitting</div>
                <p style="font-size:12px;color:#9ca3af;margin-top:4px;font-weight:400;">Your bespoke reservation has been registered.</p>
                
                <button type="button" onclick="window.closeReservationSuccessModal()" style="position:absolute;top:20px;right:20px;background:rgba(255,255,255,0.1);border:none;color:#ffffff;width:34px;height:34px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;line-height:1;transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'" aria-label="Close">
                    ✕
                </button>
            </div>

            <!-- Body -->
            <div style="padding:24px 28px;">
                <!-- Confirmation Badge -->
                <div style="display:flex;align-items:center;gap:14px;background:#f8fafc;padding:14px 18px;border-radius:14px;border:1px solid #e2e8f0;margin-bottom:20px;">
                    <div style="width:38px;height:38px;border-radius:50%;background:#16a34a;color:#ffffff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;flex-shrink:0;box-shadow:0 4px 10px rgba(22,163,74,0.3);">✓</div>
                    <div>
                        <div style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Booking Reference Code</div>
                        <div style="font-size:16px;font-weight:900;letter-spacing:0.06em;color:#0f172a;">${bookingId}</div>
                    </div>
                </div>

                <!-- Appointment details grid -->
                <div style="display:flex;flex-direction:column;gap:11px;font-size:13px;border-bottom:1px dashed #e2e8f0;padding-bottom:18px;margin-bottom:18px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="color:#64748b;font-weight:500;">Guest Name:</span>
                        <span style="font-weight:700;color:#0f172a;text-align:right;">${name}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="color:#64748b;font-weight:500;">Couture Service:</span>
                        <span style="font-weight:600;color:#0f172a;text-align:right;max-width:240px;">${service}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="color:#64748b;font-weight:500;">Scheduled Time:</span>
                        <span style="font-weight:800;color:#cc0000;text-align:right;">${date} • ${time}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                        <span style="color:#64748b;font-weight:500;">Salon Suite:</span>
                        <span style="font-weight:600;color:#0f172a;text-align:right;font-size:12px;max-width:240px;">${location}</span>
                    </div>
                    ${phone ? `
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="color:#64748b;font-weight:500;">Contact Phone:</span>
                        <span style="font-weight:600;color:#0f172a;text-align:right;">${phone}</span>
                    </div>` : ''}
                </div>

                <div style="background:#fef2f2;border:1px solid #fee2e2;border-radius:10px;padding:10px 14px;margin-bottom:20px;display:flex;align-items:center;gap:10px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#cc0000" stroke-width="2" style="flex-shrink:0;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <p style="font-size:11px;color:#991b1b;line-height:1.4;margin:0;">
                        Our senior atelier consultant will have custom garments and fabrics reserved for your session.
                    </p>
                </div>

                <!-- Actions -->
                <button type="button" onclick="window.closeReservationSuccessModal()" style="width:100%;background:#000000;color:#ffffff;padding:14px;border:none;border-radius:12px;font-size:12px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 12px rgba(0,0,0,0.15);" onmouseover="this.style.background='#262626'" onmouseout="this.style.background='#000000'">
                    Dismiss & Return to Atelier
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        const inner = modal.querySelector('div');
        if (inner) inner.style.transform = 'scale(1)';
    });

    window.closeReservationSuccessModal = function() {
        modal.style.opacity = '0';
        const inner = modal.querySelector('div');
        if (inner) inner.style.transform = 'scale(0.92)';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    };

    modal.addEventListener('click', (e) => {
        if (e.target === modal) window.closeReservationSuccessModal();
    });
};

/**
 * Validate Private Appointment Form (in about.html and sitewide)
 */
window.validateAppointmentForm = function(event, form) {
    if (event) event.preventDefault();
    
    const serviceEl = document.getElementById('appt-service');
    const nameEl = document.getElementById('appt-name');
    const phoneEl = document.getElementById('appt-phone');
    const dateEl = document.getElementById('appt-date');
    const timeEl = document.getElementById('appt-time');
    const notesEl = document.getElementById('appt-notes');
    
    const service = serviceEl ? (serviceEl.selectedOptions ? serviceEl.selectedOptions[0].text : serviceEl.value) : 'Bespoke Atelier Fitting';
    const name = nameEl ? nameEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const date = dateEl ? dateEl.value : '';
    const time = timeEl ? (timeEl.selectedOptions ? timeEl.selectedOptions[0].text : timeEl.value) : '11:00 AM';
    const notes = notesEl ? notesEl.value.trim() : '';
    
    // Constraint 1: Name validation
    if (!name || name.length < 2) {
        window.showGlobalToast('Validation Error', 'Please enter your full name (at least 2 letters).', 'error');
        if (nameEl) { nameEl.classList.add('is-invalid'); nameEl.focus(); }
        return false;
    }
    if (!namePattern.test(name)) {
        window.showGlobalToast('Validation Error', 'Name contains invalid characters (letters only).', 'error');
        if (nameEl) { nameEl.classList.add('is-invalid'); nameEl.focus(); }
        return false;
    }
    if (nameEl) nameEl.classList.remove('is-invalid');
    
    // Constraint 2: Phone validation (strictly 10 digits)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!phone || cleanPhone.length === 0) {
        window.showGlobalToast('Validation Error', 'Please enter your 10-digit contact phone number.', 'error');
        if (phoneEl) { phoneEl.classList.add('is-invalid'); phoneEl.focus(); }
        return false;
    }
    if (!phonePattern.test(cleanPhone) || cleanPhone.length !== 10) {
        window.showGlobalToast('Validation Error', 'Phone number must be exactly 10 digits (e.g. 9876543210).', 'error');
        if (phoneEl) { phoneEl.classList.add('is-invalid'); phoneEl.focus(); }
        return false;
    }
    if (phoneEl) phoneEl.classList.remove('is-invalid');
    
    // Constraint 3: Date validation
    if (!date) {
        window.showGlobalToast('Validation Error', 'Please select a preferred appointment date.', 'error');
        if (dateEl) { dateEl.classList.add('is-invalid'); dateEl.focus(); }
        return false;
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
        window.showGlobalToast('Validation Error', 'Appointment date cannot be in the past.', 'error');
        if (dateEl) { dateEl.classList.add('is-invalid'); dateEl.focus(); }
        return false;
    }
    if (dateEl) dateEl.classList.remove('is-invalid');
    
    // Constraint 4: Time validation
    if (!time) {
        window.showGlobalToast('Validation Error', 'Please choose a preferred time window.', 'error');
        if (timeEl) { timeEl.classList.add('is-invalid'); timeEl.focus(); }
        return false;
    }
    if (timeEl) timeEl.classList.remove('is-invalid');
    
    // Constraint 5: Notes length validation
    if (notes.length > 500) {
        window.showGlobalToast('Validation Error', 'Sartorial requests must be within 500 characters.', 'error');
        if (notesEl) { notesEl.classList.add('is-invalid'); notesEl.focus(); }
        return false;
    }
    if (notesEl) notesEl.classList.remove('is-invalid');
    
    // Close modal if open
    const modal = document.getElementById('appointment-modal');
    if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modal.classList.remove('opacity-100');
        document.body.style.overflow = '';
    }
    
    // Pop up confirmation message modal
    const formattedDate = new Date(date).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    window.showReservationSuccessModal({
        name: name,
        service: service,
        date: formattedDate,
        time: time,
        phone: phone,
        location: 'Salem Flagship Atelier — MMR Complex, Chinnathirupathi'
    });
    
    window.showGlobalToast('Salon Reserved ✓', `Private appointment booked for ${name} on ${formattedDate}.`, 'success');
    
    if (form) form.reset();
    return true;
};

/**
 * Validate Login Form (in login.html)
 */
window.validateLoginForm = function(event) {
    event.preventDefault();
    
    const emailEl = document.getElementById('login-email');
    const passwordEl = document.getElementById('login-password');
    const roleInput = document.getElementById('login-role');
    
    const email = emailEl ? emailEl.value.trim() : '';
    const password = passwordEl ? passwordEl.value : '';
    const role = (roleInput && roleInput.value === 'admin') ? 'admin' : 'user';
    const isUser = (role === 'user');
    const roleTitle = isUser ? 'VIP Client' : 'Administrator';
    
    if (!email) {
        window.showGlobalToast('Login Error', 'Please enter your email address.', 'error');
        if (emailEl) emailEl.focus();
        return false;
    }
    
    if (!emailPattern.test(email) || email.length < 5) {
        window.showGlobalToast('Login Error', 'Please enter a valid email address format.', 'error');
        if (emailEl) emailEl.focus();
        return false;
    }
    
    if (!password || password.length < 6) {
        window.showGlobalToast('Login Error', 'Password must be at least 6 characters long.', 'error');
        if (passwordEl) passwordEl.focus();
        return false;
    }
    
    // Simulate login
    const btn = document.getElementById('login-submit-btn');
    const originalText = btn ? btn.innerHTML : 'Enter Atelier';
    if (btn) {
        btn.textContent = 'Authenticating Credentials…';
        btn.disabled = true;
    }
    
    setTimeout(() => {
        sessionStorage.setItem('stackly_auth', JSON.stringify({
            email: email,
            name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            role: roleTitle,
            roleKey: role,
            loginTime: new Date().toISOString()
        }));
        
        const savedRedirect = sessionStorage.getItem('stackly_redirect');
        sessionStorage.removeItem('stackly_redirect');
        const targetUrl = (savedRedirect && ((role === 'admin' && savedRedirect.includes('admin')) || (role === 'user' && savedRedirect.includes('user'))))
            ? savedRedirect
            : (isUser ? 'user-dashboard.html' : 'admin.html');
            
        window.showGlobalToast('Welcome Back', `Authenticated as ${roleTitle}. Redirecting to suite…`, 'success');
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 1000);
    }, 1100);
    
    return true;
};

/**
 * Validate Signup Form (in signup.html)
 */
window.validateSignupForm = function(event) {
    event.preventDefault();
    
    const fnameEl = document.getElementById('signup-fname');
    const lnameEl = document.getElementById('signup-lname');
    const emailEl = document.getElementById('signup-email');
    const passwordEl = document.getElementById('signup-password');
    const confirmEl = document.getElementById('signup-confirm');
    const termsEl = document.getElementById('signup-terms');
    const roleInput = document.getElementById('signup-role');
    
    const fname = fnameEl ? fnameEl.value.trim() : '';
    const lname = lnameEl ? lnameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const password = passwordEl ? passwordEl.value : '';
    const confirm = confirmEl ? confirmEl.value : '';
    const terms = termsEl ? termsEl.checked : false;
    const role = (roleInput && roleInput.value === 'admin') ? 'admin' : 'user';
    const isUser = (role === 'user');
    const roleTitle = isUser ? 'VIP Client' : 'Administrator';
    
    if (!fname || fname.length < 2) {
        window.showGlobalToast('Validation Error', 'First name must be at least 2 characters.', 'error');
        if (fnameEl) fnameEl.focus();
        return false;
    }
    if (!namePattern.test(fname)) {
        window.showGlobalToast('Validation Error', 'First name contains invalid characters.', 'error');
        if (fnameEl) fnameEl.focus();
        return false;
    }
    
    if (!lname || lname.length < 1) {
        window.showGlobalToast('Validation Error', 'Please enter your last name.', 'error');
        if (lnameEl) lnameEl.focus();
        return false;
    }
    
    if (!email || !emailPattern.test(email) || email.length < 5) {
        window.showGlobalToast('Validation Error', 'Please enter a valid email address.', 'error');
        if (emailEl) emailEl.focus();
        return false;
    }
    
    if (!password || password.length < 8) {
        window.showGlobalToast('Validation Error', 'Password must contain at least 8 characters.', 'error');
        if (passwordEl) passwordEl.focus();
        return false;
    }
    
    if (password !== confirm) {
        window.showGlobalToast('Validation Error', 'Passwords do not match. Please re-enter your password.', 'error');
        if (confirmEl) confirmEl.focus();
        return false;
    }
    
    if (!terms) {
        window.showGlobalToast('Validation Error', 'You must agree to the Terms of Service & Privacy Policy.', 'error');
        if (termsEl) termsEl.focus();
        return false;
    }
    
    const btn = document.getElementById('signup-submit-btn');
    const originalText = btn ? btn.innerHTML : 'Create Account';
    if (btn) {
        btn.textContent = 'Registering Atelier Account…';
        btn.disabled = true;
    }
    
    setTimeout(() => {
        sessionStorage.setItem('stackly_auth', JSON.stringify({
            email: email,
            name: `${fname} ${lname}`,
            role: roleTitle,
            roleKey: role,
            loginTime: new Date().toISOString()
        }));
        
        const savedRedirect = sessionStorage.getItem('stackly_redirect');
        sessionStorage.removeItem('stackly_redirect');
        const targetUrl = (savedRedirect && ((role === 'admin' && savedRedirect.includes('admin')) || (role === 'user' && savedRedirect.includes('user'))))
            ? savedRedirect
            : (isUser ? 'user-dashboard.html' : 'admin.html');
            
        window.showGlobalToast('Account Created ✓', `Welcome to the Maison, ${fname}! Loading your private dashboard…`, 'success');
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 1100);
    }, 1200);
    
    return true;
};

/**
 * Sitewide Navigation Auth Sync
 * Keeps header/footer auth links as "Login" in all pages
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        const authData = JSON.parse(sessionStorage.getItem('stackly_auth') || 'null');
        if (authData && authData.name) {
            const isUser = authData.roleKey !== 'admin';
            const target = isUser ? 'user-dashboard.html' : 'admin.html';
            document.querySelectorAll('a[href="login.html"], a[href="user-dashboard.html"], a[href="admin.html"]').forEach(a => {
                a.href = target;
                const txt = a.textContent.trim().toLowerCase();
                // Ensure text is explicitly "Login" as requested by user instead of "My Atelier" or "Atelier"
                if (txt === 'my atelier' || txt === 'atelier' || txt === 'client atelier') {
                    a.textContent = 'Login';
                }
            });
        }
    } catch(e) {}
});

/**
 * Global Handler for Public Page Unused Links
 * STRICT RULE: In dashboards (admin.html & user-dashboard.html), NO EXTERNAL NAVIGATION IS ALLOWED.
 * Only Sign Out navigates away.
 */
document.addEventListener('click', (e) => {
    const isDashboard = window.location.pathname.includes('admin.html') || window.location.pathname.includes('user-dashboard.html');
    
    // In dashboards, ignore 404 redirections completely
    if (isDashboard) {
        const a = e.target.closest('a');
        if (a) {
            const href = a.getAttribute('href');
            if (href === '#' || href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
                e.preventDefault();
                return;
            }
        }
        return;
    }
    
    // 1. Unused / placeholder anchor tags on PUBLIC pages (#, empty, javascript:void(0))
    const a = e.target.closest('a');
    if (a) {
        const href = a.getAttribute('href');
        if (href === '#' || href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
            e.preventDefault();
            window.location.href = '404.html';
            return;
        }
    }
    
    // 2. Explicit 404 action buttons on public pages
    const btn = e.target.closest('button');
    if (btn && btn.getAttribute('data-action') === '404') {
        e.preventDefault();
        window.location.href = '404.html';
    }
});

/**
 * Global Phone Input Constraint (Strictly 10 digits only)
 */
document.addEventListener('DOMContentLoaded', () => {
    const bindPhoneConstraints = () => {
        document.querySelectorAll('input[type="tel"], input#contact-phone, input#appt-phone').forEach(inp => {
            inp.setAttribute('maxlength', '10');
            inp.setAttribute('inputmode', 'numeric');
            inp.setAttribute('pattern', '[0-9]{10}');
            inp.addEventListener('input', (e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                if (e.target.value !== cleaned) {
                    e.target.value = cleaned;
                }
            });
        });
    };
    bindPhoneConstraints();
    setTimeout(bindPhoneConstraints, 500);
});

