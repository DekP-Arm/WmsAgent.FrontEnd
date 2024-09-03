import { useEffect , useState } from "react";
import { number } from "zod";

interface Checker{
    check_id:number;
    unite_id : number;
    order_id:number;
    item_id:number;
    item_qty :number;
    reason : string ;
    date_check:string;
    date_exp:string;
}

const initialOrders: Checker[] = [
    {
        check_id:1,unite_id:1,order_id:1,item_id:1,item_qty:15,reason:"",date_check:"10-10-2022" , date_exp:"10-10-2024"
    },
    {
        check_id:2,unite_id:2,order_id:2,item_id:2,item_qty:35,reason:"",date_check:"10-10-2022" , date_exp:"10-10-2024"
    }
    ,{
        check_id:3,unite_id:3,order_id:3,item_id:3,item_qty:15,reason:"",date_check:"10-10-2022" , date_exp:"10-10-2024"
    },
    {
        check_id:4,unite_id:4,order_id:4,item_id:4,item_qty:25,reason:"",date_check:"10-10-2022" , date_exp:"10-10-2024"
    }
]


const getCheckIdFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return Number(params.get('id')); 
};
export default function CheckerList(){
    const [check_id  ,setCheckId] = useState(0);
    useEffect(() => {
        const checkId = getCheckIdFromUrl();
        // fetchDataLocation(warehouseId);
        setCheckId(checkId);
    }, []);
    const [checker , setChecker] = useState<Checker[]>(initialOrders)

    return(
        <div className=" w-full bg-slate-400 grid place-items-center">
            <div className="mt-20 mb-5 p-10  bg-gray-800 rounded-lg"> 
                <h1 className="text-2xl text-white">check_id : {check_id}</h1>
            </div>

            {checker?.map( (c)=>
                c.check_id === check_id ?
                (
                <div className="py-4 px-10 bg-slate-600 text-white text-2xl rounded-xl mb-28" key={c.check_id}>
                    item_id : {c.item_id}<br/>
                    date_check : {c.date_check}<br/>
                    date_exp : {c.date_exp}<br/>
                    unit_id : {c.unite_id} <br/>
                    item quantity : {c.item_qty} unit
                </div>
                ) : null
            )}
         
        </div>
    )
}