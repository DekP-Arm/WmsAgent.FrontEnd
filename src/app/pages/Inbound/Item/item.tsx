'use client';
import { InputLabel } from "~/app/_components/InputLabel";
import { useState } from "react";

export default function Item() {
    const [qty, setQty] = useState('');
    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('');

    const QtyInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setQty(e.target.value);
    }

    const WeightInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setWeight(e.target.value);
    }

    const UnitInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setUnit(e.target.value);
    }
    return (
            <>
            <form action="">
                <section className="flex flex-col rounded-xl bg-white p-6 justify-center items-center h-full">
                    <div className="max-w-md mx-auto p-6 bg-slate-200 rounded-lg w-screen gap-10">
                        <h1 className="text-xl">Item Order</h1>
                        <InputLabel label="Qty" type="text" placeholder=" " value={qty} onChange={QtyInputChange}/>  
                        <InputLabel label="Weight" type="text" placeholder=" " value={weight} onChange={WeightInputChange}/>
                        <InputLabel label="Unit" type="text" placeholder=" " value={unit} onChange={UnitInputChange}/>
                    </div>
                </section>
            </form>
                
            </>
        );
}
