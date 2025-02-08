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

                    // ניסיון פענוח חכם לפי סוג הנתונים
                    if (record.data && record.data instanceof ArrayBuffer) {
                        scannedData = arrayBufferToHex(record.data); // המרה ל-Hex
                    } else if (record.recordType === "text") {
                        scannedData = textDecoder(record); // קריאה תקינה
                    } else {
                        scannedData = "❌ נתונים לא מזוהים";
                    }

                    scannedData = scannedData.trim();
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

// פונקציה להמרת ArrayBuffer ל-Hexadecimal
function arrayBufferToHex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join(":");
}

// פונקציה לקריאת טקסט אם הפורמט נתמך
function textDecoder(record) {
    try {
        const decoder = new TextDecoder("utf-8");
        return decoder.decode(record.data);
    } catch {
        return "❌ שגיאה בפענוח טקסט";
    }
}

// פונקציה לבדיקת קוד NFC מול הרשימה
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
