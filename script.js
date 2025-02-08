document.getElementById('startNFC').addEventListener('click', async () => {
    if ('NDEFReader' in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            console.log("NFC מוכן לקריאה");

            nfcReader.onreading = event => {
                const decoder = new TextDecoder();
                for (const record of event.message.records) {
                    const scannedCode = decoder.decode(record.data);
                    console.log(`זיהוי קוד: ${scannedCode}`);
                    checkNFC(scannedCode);
                }
            };
        } catch (error) {
            console.error("שגיאה בהפעלת NFC:", error);
        }
    } else {
        alert("הדפדפן שלך לא תומך ב-NFC Web API");
    }
});

function checkNFC(scannedCode) {
    let boxes = document.querySelectorAll('.box');
    let allGreen = true;

    boxes.forEach(box => {
        if (box.dataset.nfc === scannedCode) {
            box.style.backgroundColor = 'green';
        }
        if (box.style.backgroundColor !== 'green') {
            allGreen = false;
        }
    });

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
        body: JSON.stringify({ message: "כל הריבועים ירוקים! אישור התקבל." })
    })
    .then(response => response.json())
    .then(data => console.log("וובהוק נשלח בהצלחה:", data))
    .catch(error => console.error("שגיאה בשליחת הוובהוק:", error));
}
