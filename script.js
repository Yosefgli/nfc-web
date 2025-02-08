document.getElementById('startNFC').addEventListener('click', async () => {
    if ('NDEFReader' in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();

            nfcReader.onreading = event => {
                event.preventDefault(); // מוודא שלא מוצגות הודעות מערכת
                let scannedUID = event.serialNumber.trim(); // מנקה רווחים מיותרים
                checkNFC(scannedUID);
            };
        } catch (error) {
            console.error("❌ שגיאה:", error.message);
        }
    } else {
        alert("⚠️ הדפדפן שלך לא תומך ב-NFC Web API");
    }
});

// בדיקה אם הקוד מתאים לריבועים
function checkNFC(scannedCode) {
    let boxes = document.querySelectorAll('.box');
    let allGreen = true;
    let foundMatch = false;

    boxes.forEach(box => {
        if (box.dataset.nfc.toLowerCase() === scannedCode.toLowerCase()) {
            box.style.backgroundColor = 'green';
            foundMatch = true;
        }
        if (box.style.backgroundColor !== 'green') {
            allGreen = false;
        }
    });

    if (allGreen) {
        sendWebhook();
    }
}

// שליחת וובהוק לאחר שכל הריבועים ירוקים
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
