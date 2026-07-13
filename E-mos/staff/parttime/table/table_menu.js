(function(){
    const btnQr = document.getElementById('btnQr');
    const btnTableNumber = document.getElementById('btnTableNumber');
    const btnBackMenu = document.getElementById('btnBackMenu');

    btnQr.addEventListener('click', ()=>{
        const text = 'テーブルQR - ' + new Date().toLocaleString();
        showQrModal(text);
    });

    btnTableNumber.addEventListener('click', ()=>{
        window.location.href = 'tablenumber_change.html';
    });

    btnBackMenu.addEventListener('click', ()=>{
        window.location.href = '../menu/menu.html';
    });

    function showQrModal(text){
        if(window.QRCode && typeof QRCode.toDataURL === 'function'){
            QRCode.toDataURL(text, { width: 300 })
            .then(url => {
                buildOverlay(url, text);
            })
            .catch(err => {
                buildFallback(text, 'QR生成に失敗しました');
            });
        } else {
            buildFallback(text, 'QRライブラリが読み込まれていません');
        }
    }

    function buildOverlay(imgSrc, captionText){
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = 0;
        overlay.style.top = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.background = 'rgba(0,0,0,0.6)';
        overlay.style.zIndex = 9999;

        const box = document.createElement('div');
        box.style.background = '#fff';
        box.style.padding = '18px';
        box.style.borderRadius = '8px';
        box.style.display = 'flex';
        box.style.flexDirection = 'column';
        box.style.alignItems = 'center';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = 'QRコード';
        img.style.width = '240px';
        img.style.height = '240px';

        const caption = document.createElement('p');
        caption.textContent = captionText;
        caption.style.margin = '10px 0 0 0';
        caption.style.fontSize = '14px';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '閉じる';
        closeBtn.style.marginTop = '12px';
        closeBtn.style.padding = '8px 12px';

        closeBtn.addEventListener('click', ()=>{ overlay.remove(); });
        overlay.addEventListener('click', (e)=>{ if(e.target === overlay) overlay.remove(); });

        box.appendChild(img);
        box.appendChild(caption);
        box.appendChild(closeBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    function buildFallback(text, msg){
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = 0;
        overlay.style.top = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.background = 'rgba(0,0,0,0.6)';
        overlay.style.zIndex = 9999;

        const box = document.createElement('div');
        box.style.background = '#fff';
        box.style.padding = '18px';
        box.style.borderRadius = '8px';
        box.style.maxWidth = '90%';

        const title = document.createElement('p');
        title.textContent = msg;
        title.style.fontWeight = '600';

        const content = document.createElement('pre');
        content.textContent = text;
        content.style.whiteSpace = 'pre-wrap';
        content.style.marginTop = '8px';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '閉じる';
        closeBtn.style.marginTop = '12px';
        closeBtn.style.padding = '8px 12px';
        closeBtn.addEventListener('click', ()=>{ overlay.remove(); });

        box.appendChild(title);
        box.appendChild(content);
        box.appendChild(closeBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }
})();
