'use strict';
document.documentElement.classList.add('js');
const $ = selector => document.querySelector(selector);
const money = value => new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 2 }).format(value) + ' DH';
const menuButton = $('.menu-toggle');
if (menuButton) {
  const nav = $('#navigation');
  const closeMenu = () => { menuButton.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menuButton.focus(); } });
}
if ($('#revenue')) {
  const calculate = () => {
    const revenue = Number($('#revenue').value), rate = Number($('#rate').value);
    $('#revenue-value').textContent = money(revenue);
    $('#rate-value').textContent = rate + ' %';
    $('#commission').textContent = money(revenue * rate / 100);
  };
  $('#revenue').addEventListener('input', calculate);
  $('#rate').addEventListener('input', calculate);
  calculate();
}
const emailLink = (subject, body) => 'mailto:contact@aiworkpay.fr?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
if ($('#contact-form')) {
  $('#contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const city = $('#contact-city').value.trim();
    if (!city) { $('#contact-city').setCustomValidity('Indiquez votre ville.'); $('#contact-city').reportValidity(); return; }
    const role = $('#contact-role').value;
    const body = `Bonjour,\n\nJe souhaite en savoir plus sur Zidozid au Maroc.\nProfil : ${role}\nVille : ${city}\n\nMon activité / ma demande :\n\nMerci.`;
    const url = emailLink('Zidozid Maroc — ' + role + ' — ' + city, body);
    $('#contact-feedback').textContent = 'Brouillon préparé. Envoyez-le depuis votre messagerie. Si elle ne s’ouvre pas, écrivez à l’adresse ci-dessous.';
    $('.contact-email').href = url;
    window.location.href = url;
  });
  $('#contact-city').addEventListener('input', () => $('#contact-city').setCustomValidity(''));
}
if ($('#diagnostic-form')) {
  const params = new URLSearchParams(window.location.search);
  if (params.get('profil') === 'livreur') $('#diag-profile').value = 'livreur';
  const calculate = () => {
    if (!$('#diagnostic-form').checkValidity()) return;
    const revenue = Number($('#diag-revenue').value), rate = Number($('#diag-rate').value);
    const commission = revenue * rate / 100;
    if (!Number.isFinite(commission)) return;
    const role = $('#diag-profile').value;
    $('#diag-revenue-label').textContent = role === 'livreur' ? 'Revenus mensuels de courses soumis à commission (DH)' : 'Ventes mensuelles soumises à commission (DH)';
    $('#diag-month').textContent = money(commission);
    $('#diag-year').textContent = money(commission * 12);
    $('#diag-mail').href = emailLink('Zidozid Maroc — diagnostic ' + role, `Bonjour,\n\nJe souhaite discuter de Zidozid pour mon activité (${role}).\nMontant mensuel soumis à commission : ${money(revenue)}\nTaux de mon contrat : ${rate} %\nCommission calculée : ${money(commission)} par mois.\nCette estimation n’est pas une économie nette.\n\nVille :\nNom de mon activité :\n\nMerci.`);
  };
  $('#diagnostic-form').addEventListener('submit', e => { e.preventDefault(); calculate(); });
  $('#diagnostic-form').addEventListener('input', calculate);
  calculate();
}
if ($('#demo-client')) {
  const products = { burger: { name: 'Menu burger maison', price: 55 }, sandwich: { name: 'Menu sandwich poulet', price: 40 }, salade: { name: 'Salade fraîche', price: 30 } };
  let cart = {}, order = null;
  const profiles = ['client', 'restaurant', 'livreur'];
  const say = message => { $('#demo-feedback').textContent = message; };
  function chooseProfile(profile) {
    if (!profiles.includes(profile)) profile = 'client';
    profiles.forEach(p => { $('#demo-' + p).hidden = p !== profile; document.querySelector('[data-profile="' + p + '"]').setAttribute('aria-pressed', String(p === profile)); });
  }
  document.querySelectorAll('[data-profile]').forEach(button => button.addEventListener('click', () => chooseProfile(button.dataset.profile)));
  chooseProfile(new URLSearchParams(window.location.search).get('profil'));
  const mode = () => document.querySelector('input[name="mode"]:checked').value;
  const subtotal = () => Object.entries(cart).reduce((sum, [id, qty]) => sum + products[id].price * qty, 0);
  function renderCart() {
    const list = $('#basket-items'); list.replaceChildren();
    Object.entries(cart).forEach(([id, qty]) => {
      const li = document.createElement('li'), label = document.createElement('span'), remove = document.createElement('button');
      label.textContent = qty + ' × ' + products[id].name + ' · ' + money(products[id].price * qty);
      remove.type = 'button'; remove.textContent = '−'; remove.setAttribute('aria-label', 'Retirer un ' + products[id].name.toLowerCase());
      remove.disabled = Boolean(order);
      remove.addEventListener('click', () => { if (order) return; cart[id]--; if (!cart[id]) delete cart[id]; renderCart(); });
      li.append(label, remove); list.append(li);
    });
    if (!Object.keys(cart).length) { const li = document.createElement('li'); li.textContent = 'Ajoutez votre premier plat.'; list.append(li); }
    const total = subtotal(), delivery = mode() === 'delivery' && total > 0 ? 15 : 0;
    $('#food-total').textContent = money(total); $('#delivery-total').textContent = money(delivery); $('#basket-total').textContent = money(total + delivery);
    $('#place-order').disabled = total === 0 || Boolean(order);
    document.querySelectorAll('.add-item,input[name="mode"]').forEach(el => el.disabled = Boolean(order));
  }
  document.querySelectorAll('.add-item').forEach(button => button.addEventListener('click', () => {
    if (order) return;
    const id = button.dataset.item;
    cart[id] = (cart[id] || 0) + 1; renderCart(); say(products[id].name + ' ajouté au panier fictif.');
  }));
  document.querySelectorAll('input[name="mode"]').forEach(input => input.addEventListener('change', renderCart));
  const statusText = () => {
    if (!order) return 'Votre commande apparaîtra ici.';
    return ({ pending: 'Envoyée au restaurant. En attente de sa réponse.', accepted: order.mode === 'delivery' && !order.taken ? 'Acceptée. La mission est proposée aux livreurs.' : 'Commande acceptée. Préparation imminente.', preparing: 'Votre commande est en préparation.', ready: order.mode === 'delivery' ? (order.taken ? 'Commande prête : votre livreur la récupère.' : 'Commande prête. En attente d’un livreur.') : 'Commande prête. Code de retrait : ZD24.', transit: 'Votre livreur est en route. Code de livraison : 4826. Course à régler en espèces.', done: order.mode === 'delivery' ? 'Commande livrée. Course encaissée en espèces. Bssaha !' : 'Commande retirée. Bssaha !' })[order.status];
  };
  function orderDetails(node, title, lines) {
    node.replaceChildren(); const heading = document.createElement('h3'); heading.textContent = title; node.append(heading);
    lines.forEach(line => { const p = document.createElement('p'); p.textContent = line; node.append(p); });
  }
  function renderOrder() {
    $('#client-order').textContent = statusText();
    $('#order-count').textContent = order ? '1' : '0'; $('#restaurant-amount').textContent = money(order ? order.food : 0);
    const rn = $('#restaurant-next'), cn = $('#courier-next'); rn.disabled = true; cn.disabled = true;
    rn.textContent = 'En attente d’une commande'; cn.textContent = 'En attente d’une mission';
    if (!order) {
      orderDetails($('#restaurant-order'), 'Aucune commande pour le moment.', ['Composez une commande dans l’espace client pour la recevoir ici.']);
      orderDetails($('#courier-order'), 'Aucune livraison à effectuer.', ['Choisissez « Livraison » dans l’espace client, puis simulez une commande.']); return;
    }
    const lines = [order.summary, (order.mode === 'delivery' ? 'Livraison' : 'À emporter') + ' · Repas payé par carte : ' + money(order.food), statusText()];
    orderDetails($('#restaurant-order'), 'Commande fictive ZD24', lines);
    const rActions = { pending: 'Accepter la commande', accepted: 'Lancer la préparation', preparing: 'Marquer la commande prête' };
    if (order.status === 'accepted' && order.mode === 'delivery' && !order.taken) { rn.textContent = 'En attente d’un livreur'; }
    else if (rActions[order.status]) { rn.textContent = rActions[order.status]; rn.disabled = false; }
    else if (order.status === 'ready' && order.mode === 'pickup') { rn.textContent = 'Simuler le retrait · code ZD24'; rn.disabled = false; }
    else rn.textContent = order.status === 'done' ? 'Commande terminée' : order.status === 'ready' ? (order.taken ? 'Le livreur récupère la commande' : 'En attente d’un livreur') : 'Livraison en cours';
    if (order.mode === 'pickup') { orderDetails($('#courier-order'), 'Cette commande est à emporter.', ['Aucune course n’est nécessaire. Recommencez pour tester une livraison.']); return; }
    const cLines = order.taken ? ['Le Snack du quartier → Client démo, Casablanca', 'Course en espèces : 15 DH à encaisser auprès du client. Commission Zidozid : 0 DH.', statusText()] : ['Mission disponible : Casablanca · course de 15 DH en espèces. Premier arrivé, premier servi.', 'L’adresse du client apparaît une fois la mission acceptée.', statusText()];
    if (order.taken && order.status === 'ready') cLines.push('Code de retrait à montrer au restaurant : ZD24.');
    if (order.status === 'transit') cLines.push('Code de livraison communiqué par le client : 4826.');
    orderDetails($('#courier-order'), 'Course fictive · Commande ZD24', cLines);
    const cActions = { ready: 'Simuler la remise · code ZD24', transit: 'Simuler la livraison · code 4826' };
    if (order.status === 'accepted' && !order.taken) { cn.textContent = 'Accepter la mission'; cn.disabled = false; }
    else if (order.status === 'ready' && order.taken) { cn.textContent = cActions.ready; cn.disabled = false; }
    else if (cActions[order.status] && order.taken) { cn.textContent = cActions[order.status]; cn.disabled = false; }
    else cn.textContent = order.status === 'done' ? 'Livraison terminée' : order.status === 'pending' ? 'En attente de l’acceptation du restaurant' : 'Mission déjà prise';
  }
  $('#place-order').addEventListener('click', () => {
    if (order || !subtotal()) return;
    order = { mode: mode(), food: subtotal(), summary: Object.entries(cart).map(([id, qty]) => qty + ' × ' + products[id].name).join(', '), status: 'pending', taken: false };
    renderCart(); renderOrder();
    say(order.mode === 'delivery' ? 'Commande simulée. Ouvrez l’espace Restaurant pour l’accepter : la mission part ensuite aux livreurs.' : 'Commande simulée. Ouvrez l’espace Restaurant pour la préparer.');
  });
  $('#restaurant-next').addEventListener('click', () => {
    if (!order) return;
    const next = { pending: 'accepted', accepted: 'preparing', preparing: 'ready' };
    if (order.status === 'accepted' && order.mode === 'delivery' && !order.taken) { say('La mission est proposée aux livreurs. Attendez qu’un livreur l’accepte.'); return; }
    if (next[order.status]) order.status = next[order.status];
    else if (order.status === 'ready' && order.mode === 'pickup') order.status = 'done';
    else return;
    renderOrder(); say(statusText() + (order.status === 'ready' && order.mode === 'delivery' ? ' Passez dans l’espace Livreur.' : ''));
  });
  $('#courier-next').addEventListener('click', () => {
    if (!order || order.mode !== 'delivery') return;
    if (order.status === 'accepted' && !order.taken) { order.taken = true; renderOrder(); say('Mission acceptée : vous êtes le livreur de cette commande. Attendez la préparation.'); return; }
    const next = { ready: 'transit', transit: 'done' };
    if (!next[order.status] || !order.taken) return;
    order.status = next[order.status]; renderOrder(); say(statusText());
  });
  $('#demo-reset').addEventListener('click', () => {
    cart = {}; order = null; document.querySelector('input[value="pickup"]').checked = true;
    renderCart(); renderOrder(); chooseProfile('client'); say('Démo réinitialisée. Ajoutez un plat pour recommencer.');
  });
  renderCart(); renderOrder();
}
