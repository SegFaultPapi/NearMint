// Ejecuta esto en la consola del navegador si tienes problemas con localStorage residual
// O simplemente ve a DevTools > Application > Local Storage > Clear All

console.log('Limpiando localStorage de ChipiWallet...');
localStorage.removeItem('chipi_wallet_address');
localStorage.removeItem('chipi_wallet_connected');
localStorage.removeItem('chipi_wallet_user_id');
console.log('✅ localStorage limpio. Recarga la página.');
