import React, { useEffect, useState } from "react";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {

    const [show, setShow] = useState(false);
    const [form, setform] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        console.log(passwords)
        setPasswordArray(passwords)
    }

    useEffect(() => {
        getPasswords()

    }, [])

    const copyText = (text) => {
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            // transition: Bounce,
        });
        navigator.clipboard.writeText(text)
    }


    const togglePassword = () => {
        setShow(!show);
    };

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

            // if any such id exists in db, delete it.
            if(form.id){
            await fetch("http://localhost:3000/", {method: "DELETE", headers: {"Content-Type": "application/json"}, body: JSON.stringify({id: form.id})})
            }

            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
            await fetch("http://localhost:3000/", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({...form, id: uuidv4()})})
            // localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]))
            // console.log([...passwordArray, form])
            setform({ site: "", username: "", password: "" })
            toast('Password saved!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                // transition: Bounce,
            });
        }
        else {
            toast('Error: Password not saved!')
        }

    }

    const deletePassword = async (id) => {
        console.log("Deleting password with id", id)
        let c = confirm("Do you really want to delete this password?")
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))
            // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id !== id)))
            let res = await fetch("http://localhost:3000/", {method: "DELETE", headers: {"Content-Type": "application/json"}, body: JSON.stringify({id})})
            // console.log([...passwordArray, form])
            toast('Password deleted!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                // transition: Bounce,
            });
        }

    }

    const editPassword = (id) => {
        console.log("Editing password with id", id)
        setform({...passwordArray.filter(i => i.id === id)[0], id: id})
        setPasswordArray(passwordArray.filter(item => item.id !== id))

    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            // transition={Bounce}
            />
            <div className="fixed inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#22c55e_100%)]"></div>

            <div className="mx-auto p-2 md:px-0 md:mycontainer">
                <h1 className="text-4xl font-bold text-center">
                    <span className="text-green-700">&lt;</span>
                    Pass
                    <span className="text-green-700">OP/&gt;</span>
                </h1>

                <p className="text-green-900 text-lg text-center">
                    Your own Password Manager
                </p>

                <div className="flex flex-col p-4 text-black gap-8 items-center">

                    <input
                        value={form.site} onChange={handleChange}
                        placeholder="Enter website URL"
                        className="rounded-full border border-green-500 w-full p-4 py-1"
                        type="text" name="site"
                    />

                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                        <input
                            value={form.username} onChange={handleChange}
                            placeholder="Enter Username"
                            className="rounded-full border border-green-500 w-full p-4 py-1"
                            type="text" name="username"
                        />

                        {/* PASSWORD FIELD */}
                        <div className="relative w-full">
                            <input
                                value={form.password} onChange={handleChange}
                                placeholder="Enter Password"
                                className="rounded-full border border-green-500 w-full p-4 py-1 pr-10"
                                type={show ? "text" : "password"} name="password"
                            />

                            <span
                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-green-700"
                                onClick={togglePassword}
                            >
                                {show ? <BiSolidHide size={26} /> : <BiSolidShow size={26} />}
                            </span>
                        </div>
                    </div>

                    <button onClick={savePassword} className="flex justify-center items-center gap-2 bg-green-500 hover:bg-green-400 rounded-full px-7 py-2 w-fit border border-green-900"><lord-icon
                        src="https://cdn.lordicon.com/jgnvfzqg.json"
                        trigger="hover"></lord-icon>
                        Save Password
                    </button>

                </div>
                <div className="passwords">
                    <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
                    {passwordArray.length === 0 && <div>No passwords to show</div>}
                    {passwordArray.length !== 0 && <table className="table-auto w-full rounded-md overflow-hidden">
                        <thead className="bg-green-800 text-white">
                            <tr>
                                <th className="py-2">Site</th>
                                <th className="py-2">Username</th>
                                <th className="py-2">Password</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {passwordArray.map((item, index) => {
                                return <tr key={index}>
                                    <td className="text-center py-2 border border-white">
                                        <div className="flex items-center justify-center">
                                            <a href={item.site} target="_blank">{item.site}</a>
                                            <div className="cursor-pointer size-7 lordiconcopy" onClick={() => { copyText(item.site) }}>
                                                <lord-icon src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px", "padding": "3px" }}>
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center py-2 border border-white">
                                        <div className="flex justify-center items-center">
                                            {item.username}
                                            <div className="cursor-pointer size-7 lordiconcopy" onClick={() => { copyText(item.username) }}>
                                                <lord-icon src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px", "padding": "3px" }}>
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center py-2 border border-white">
                                        <div className="flex items-center justify-center">
                                            {item.password}
                                            <div className="cursor-pointer size-7 lordiconcopy" onClick={() => { copyText(item.password) }}>
                                                <lord-icon src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px", "padding": "3px" }}>
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center py-2 border border-white">
                                        <span className="cursor-pointer mx-3" onClick={() => { editPassword(item.id) }} ><lord-icon o
                                            src="https://cdn.lordicon.com/gwlusjdu.json"
                                            trigger="hover"
                                            style={{ "width": "25px", "height": "25px", "padding": "3px" }}>
                                        </lord-icon></span>
                                        <span className="cursor-pointer mx-3" onClick={() => { deletePassword(item.id) }} ><lord-icon
                                            src="https://cdn.lordicon.com/skkahier.json"
                                            trigger="hover"
                                            style={{ "width": "25px", "height": "25px", "padding": "3px" }}>
                                        </lord-icon></span>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>}
                </div>
            </div>
        </>
    );
};

export default Manager;
