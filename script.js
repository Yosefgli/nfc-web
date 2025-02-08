document.getElementById('startNFC').addEventListener('click', async () => {
    if ('NDEFReader' in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();

            nfcReader.onreading = event => {
                event.preventDefault(); // מונע הודעות מערכת מיותרות
                let scannedUID = event.serialNumber.trim(); // ניקוי רווחים מיותרים
                checkNFC(scannedUID);
            };
        } catch (error) {
            console.error("❌ שגיאה:", error.message);
        }
    } else {
        alert("⚠️ הדפדפן שלך לא תומך ב-NFC Web API");
    }
});

// בדיקה אם ה-UID מתאים לאחד הריבועים
function checkNFC(scannedCode) {
    let boxes = document.querySelectorAll('.box');
    let foundMatch = false;

    boxes.forEach(box => {
        if (box.dataset.nfc.toLowerCase() === scannedCode.toLowerCase()) {
            box.style.backgroundColor = 'green';
            foundMatch = true;
        }
    });

    if (!foundMatch) {
        console.log("⚠️ אין התאמה לקוד שנקלט!");
    }
}

// מאזין לכפתור "שלח וובהוק"
document.getElementById('sendWebhook').addEventListener('click', () => {
    let greenBoxes = [];

    document.querySelectorAll('.box').forEach(box => {
        if (box.style.backgroundColor === 'green') {
            greenBoxes.push(box.textContent.trim()); // הוספת שם הריבוע שצבוע בירוק
        }
    });

    if (greenBoxes.length > 0) {
        sendWebhook(greenBoxes);
    } else {
        alert("⚠️ אין ריבועים צבועים בירוק!");
    }
});

// שליחת וובהוק עם שמות הריבועים שצבועים בירוק
function sendWebhook(greenBoxes) {
    const webhookURL = "https://hook.integrator.boost.space/6596she29xov3falmux3q83qemwkb1tl";

    fetch(webhookURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ greenBoxes: greenBoxes })
    })
    .then(response => response.json())
    .then(data => console.log("🚀 וובהוק נשלח בהצלחה:", data))
    .catch(error => console.error("❌ שגיאה בשליחת הוובהוק:", error));
}
