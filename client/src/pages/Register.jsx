import { useState, useEffect } from "react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [profileBase64, setProfileBase64] = useState(null);

    async function userRegister(event) {
        event.preventDefault();

        /*
            מפני שברצוננו לשלוח גם קובץ תמונה FormData בניגוד לטופס ההרשמה, כאן אנחנו יוצרים 
            יש לשים לב שהשדות יהיו באותו שם 
            אלא כטופס מידע JSON בנוסף היות ואנחנו לא שולחים את המידע בפורמט 
            JSON יש למחוק את שורת ההדק המגדירה שהמידע שנשלח הוא 
        */
        try {
            let formData = new FormData();
            formData.append('file', profileImage);
            formData.append('username', username);
            formData.append('password', password);

            //send data to server
            let response = await fetch('http://localhost:5500/api/auth/register', {
                method: 'POST',
                body: formData
            });
            let data = await response.json();

            console.log('data ==> ', data);
            console.log('response ==> ', response);
        } catch (error) {
            console.log('Error ==> ', error);
        }

    }

    function showImage() {
        if (!profileImage) return;

        const fileReader = new FileReader();

        fileReader.onload = () => {
            setProfileBase64(fileReader.result);
        }

        fileReader.readAsDataURL(profileImage);
    }

    function resetForm() {
        setProfileBase64(null);
        setProfileImage(null);
    }

    //showImage כל פעם שהמשתמש בוחר תמונה מהמחשב שלו, היא תוצג לו באמצעות הפעלת הפונקציה 
    //התמונה מוצגת באופן לקאלי ולא עולה לענן, אלא רק כאשר המשתמש ילחץ על כפתור ההרשמה
    useEffect(showImage, [profileImage]);

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={userRegister}>
                <input type="text" placeholder="Username" onChange={(event) => setUsername(event.target.value)} />
                <input type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
                <input type="file" name="file" id="file" onChange={(event) => setProfileImage(event.target.files[0])} />
                {profileBase64 && <img src={profileBase64} width="150" />}
                <button type="submit">Register</button>
                <button type="reset" onClick={resetForm}>Clear</button>
            </form>
        </div>
    );
}