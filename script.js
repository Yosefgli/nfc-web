document.getElementById('startNFC').addEventListener('click', async () => {
    if ('NDEFReader' in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            document.body.insertAdjacentHTML("beforeend", "<p>✅ NFC הופעל, מוכן לקריאה</p>");

            nfcReader.onreading = event => {
                document.body.insertAdjacentHTML("beforeend", "<p>📡 קריאה התקבלה מה-NFC!</p>");
                
                for (const record of event.message.records) {
                    let scannedData;

                    // בדיקת סוג הנתונים לפני ניסיון פענוח
                    if (record.data instanceof ArrayBuffer) {
                        scannedData = arrayBufferToHex(record.data); // המרה ל-Hex
                    } else if (typeof record.data === "string") {
                        scannedData = record.data.trim();
                    } else {
                        scannedData = "❌ נתונים לא מזוהים";
                    }

                    document.body.insertAdjacentHTML("beforeend", `<p>🔍 קוד שנסרק: ${scannedData}</p>`);
                    
                    checkNFC(scannedData);
                }
            };
        } catch (error) {
            document.body.insertAdjacentHTML("beforeend", `<p>❌ שגיאה: ${error.message}</p>`);
        }
    } else {
        alert("⚠️ הדפדפן שלך לא תומך ב-NFC Web API");
    }
});

// פונקציה להמרת ArrayBuffer למחרוזת Hex
function arrayBufferToHex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join(":");
}

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
        document.body.insertAdjacentHTML("beforeend", "<p>⚠️ אין התאמה לקוד שנקלט!</p>");
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
