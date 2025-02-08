document.getElementById('startNFC').addEventListener('click', async () => {
    if ('NDEFReader' in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            console.log("✅ NFC הופעל, מוכן לקריאה");

            nfcReader.onreading = event => {
                console.log("📡 קריאה התקבלה מה-NFC");
                const decoder = new TextDecoder();
                
                for (const record of event.message.records) {
                    let scannedCode = decoder.decode(record.data);
                    console.log(`🔍 קוד שנסרק: ${scannedCode}`);
                    
                    // ניקוי תווים ריקים והסרת רווחים מיותרים
                    scannedCode = scannedCode.trim();
                    
                    checkNFC(scannedCode);
                }
            };
        } catch (error) {
            console.error("❌ שגיאה בהפעלת NFC:", error);
        }
    } else {
        alert("⚠️ הדפדפן שלך לא תומך ב-NFC Web API");
    }
});

function checkNFC(scannedCode) {
    let boxes = document.querySelectorAll('.box');
    let allGreen = true;
    let foundMatch = false;

    boxes.forEach(box => {
        console.log(`📍 בודק מול: ${box.dataset.nfc}`);
        
        if (box.dataset.nfc.toLowerCase() === scannedCode.toLowerCase()) {
            box.style.backgroundColor = 'green';
            foundMatch = true;
        }
        if (box.style.backgroundColor !== 'green') {
            allGreen = false;
        }
    });

    if (!foundMatch) {
        console.warn("⚠️ אין התאמה לקוד שנקלט!");
    }

    if (allGreen) {
        sendWebhook();
    }
}

function sendWebhook() {
    const webhookURL = "https://hook.integrator.boost.space/6596she29xov3falmux3q83qemwkb1tl";
    
    fetch(webhookURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: "✅ כל הריבועים ירוקים! אישור התקבל." })
    })
    .then(response => response.json())
    .then(data => console.log("🚀 וובהוק נשלח בהצלחה:", data))
    .catch(error => console.error("❌ שגיאה בשליחת הוובהוק:", error));
}
