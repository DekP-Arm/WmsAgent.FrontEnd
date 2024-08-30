"use client"
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from '~/app/_context/Theme';
import React, {
    Dispatch,
    SetStateAction,
    useState,
    DragEvent,
    FormEvent,
  } from "react";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";

interface Checker{
    check_id:string;
    unite_id : number;
    order_id:number;
    item_id:number;
    item_qty :number;
    reason : string ;
    date_check:string;
    date_exp:string;
    column: ColumnType;
}
type ColumnType = "UnCheck" | "Checked" | "Reject";

const DEFAULT_CHECKS: Checker[] = [
    {
        check_id:"1",unite_id:1,order_id:1,item_id:1,item_qty:15,reason:"Uncomment",date_check:"10-10-2022" , date_exp:"10-10-2024" , column:"UnCheck"
    },
    {
        check_id:"2",unite_id:2,order_id:2,item_id:2,item_qty:35,reason:"Uncomment",date_check:"10-10-2022" , date_exp:"07-10-2024", column:"UnCheck"
    }
    ,{
        check_id:"3",unite_id:3,order_id:3,item_id:3,item_qty:15,reason:"Uncomment",date_check:"10-10-2022" , date_exp:"15-10-2024", column:"Checked"
    },
    {
        check_id:"4",unite_id:4,order_id:4,item_id:4,item_qty:25,reason:"Uncomment",date_check:"10-10-2022" , date_exp:"30-10-2024", column:"UnCheck"
    },
    {
        check_id:"5",unite_id:5,order_id:5,item_id:5,item_qty:18,reason:"Uncomment",date_check:"10-10-2022" , date_exp:"12-10-2024", column:"UnCheck"
    }
    ,
    {
        check_id:"6",unite_id:6,order_id:6,item_id:6,item_qty:16,reason:"Uncomment",date_check:"10-10-2022" , date_exp:"12-10-2024", column:"UnCheck"
    }
    ,
    {
        check_id:"7",unite_id:7,order_id:7,item_id:7,item_qty:17,reason:"Uncomment",date_check:"10-10-2022" , date_exp:"12-10-2024", column:"UnCheck"
    }
]

// check_id   , order_id , unit_id  ,  item_id  , qty  , rs  ,  date_c ,  date_exp

export default function Checker(){
    const router = useRouter();
    const { isDarkMode } = useTheme();
    return (
        <div className={`${isDarkMode ? ' bg-gray-900' :
            ' bg-neutral-300'} grid w-full `}>
            <div className="grid place-items-center mt-6 mb-52">
                <div className={`${isDarkMode ? 'bg-gray-700': 'bg-white'} w-4/5  rounded-lg pb-5 `}>
                    <h1 className="shadow-md shadow-slate-700 rounded-xl flex mt-5 text-center text-2xl pt-3 pb-3 pr-14 pl-14 bg-gray-800 text-white mx-10 ">
                    Checker Board 
                    </h1>
                    <Board/>
                    <div className="w-full grid place-items-center py-5">
                        <button className="px-5 py-3 text-2xl rounded-md text-white  bg-green-600 hover:bg-green-400" onClick={()=>{alert("Succees!!")}}>
                            Verify Check
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}


const Board = ()=> {
    const router = useRouter();
    const [checkers , setChecker] = useState<Checker[]>(DEFAULT_CHECKS);
    const [selectCheck , setSelectCheck] = useState<Checker | null>(null);
    const handleCheckClick = (checker : Checker) =>{
        setSelectCheck(checker);
    };
    const handleCloseModal = ()=>{
        setSelectCheck(null);
    }
    return(
        <div className="grid grid-cols-3 pl-10 pr-8  py-10 gap-3 ">
               <Column
                title="UnCheck"
                column="UnCheck"
                headingColor="text-white-500"
                background= "bg-gray-400"
                checkers={checkers}
                setChecker={setChecker}
                onCheckerClick={handleCheckClick}>
                </Column> 
                <Column
                title="Checked"
                column="Checked"
                headingColor="text-white-500"
                background= "bg-green-400"
                checkers={checkers}
                setChecker={setChecker}
                onCheckerClick={handleCheckClick}>
                </Column>
                <Column
                title="Reject"
                column="Reject"
                headingColor="text-white-500"
                background= "bg-red-400"
                checkers={checkers}
                setChecker={setChecker}
                onCheckerClick={handleCheckClick}>
                </Column>
            {/* <BurnBarrel setChecker={setChecker} /> */}
            {selectCheck && (
                <Modal check={selectCheck} onClose={handleCloseModal} />
            )}
        </div>
    )
}
type ColumnProps = {
    title: string;
    headingColor: string;
    background:string;
    checkers: Checker[];
    column: ColumnType;
    setChecker: Dispatch<SetStateAction<Checker[]>>;
    onCheckerClick: (checker: Checker) => void;
  };
const Column = ({
        title,
        background,
        headingColor,
        checkers,
        column,
        setChecker,
        onCheckerClick,
      }: ColumnProps) => {
        const [active, setActive] = useState(false);
        const handleDragStart = (e: DragEvent, checker: Checker) => {
            e.dataTransfer.setData("checkerId", checker.check_id);
          };
        const handleDragEnd = (e: DragEvent) => {
        const checkerId = e.dataTransfer.getData("checkerId");
    
        setActive(false);
        clearHighlights();
    
        const indicators = getIndicators();
        const { element } = getNearestIndicator(e, indicators);
        const before = element.dataset.before || "-1";

    if (before !== checkerId) {
        let copy = [...checkers];
        let checkerToTransfer = copy.find((c) => c.check_id === checkerId);
        if (!checkerToTransfer) return;
        checkerToTransfer = { ...checkerToTransfer, column };
        copy = copy.filter((c) => c.check_id !== checkerId);

        const moveToBack = before === "-1";

        if (moveToBack) {
            copy.push(checkerToTransfer);
        } else {
            const insertAtIndex = copy.findIndex((el) => el.check_id === before);
            if (insertAtIndex === undefined) return;

            copy.splice(insertAtIndex, 0, checkerToTransfer);
        }
        setChecker(copy);
        }
    };
    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        highlightIndicator(e);
        setActive(true);
    };
    const clearHighlights = (els?: HTMLElement[]) => {
        const indicators = els || getIndicators();
    
        indicators.forEach((i) => {
          i.style.opacity = "0";
        });
    };
    const highlightIndicator = (e: DragEvent) => {
        const indicators = getIndicators();
    
        clearHighlights(indicators);
    
        const el = getNearestIndicator(e, indicators);
    
        el.element.style.opacity = "1";
    };

    const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;
    
    const el = indicators.reduce(
        (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
        },
          {
            offset: Number.NEGATIVE_INFINITY,
            element: indicators[indicators.length - 1],
          }
        );
    
        return el;
    };
    const getIndicators = () => {
        return Array.from(
          document.querySelectorAll(
            `[data-column="${column}"]`
          ) as unknown as HTMLElement[]
        );
    };
    const handleDragLeave = () => {
        clearHighlights();
        setActive(false);
    };
    const filteredChecker = checkers.filter((c) => c.column === column);
    return (
    <div className={`w-66 ${background} pb-20 px-5 rounded-2xl`}>
        <div className="mb-3 flex items-center justify-between">
        <h3 className={`mt-5 text-2xl font-bold text-center border-2 border-black bg-white rounded-xl px-5 py-2 ${headingColor}`}>{title}</h3>
        <span className="mt-5 rounded text-2xl font-bold  text-gray-900">
            {filteredChecker.length}
        </span>
        <div className="h-10"></div>
        </div>
        <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
            active ? "bg-neutral-800/10" : "bg-neutral-500/0"
        }`}
        >
        {filteredChecker.map((c) => (
            <Check
            key={c.check_id}
            {...c}
            handleDragStart={handleDragStart}
            onCheckerClick={onCheckerClick}
            />
        ))}
        <DropIndicator beforeId={null} column={column} />
        </div>
    </div>
    );
}
type CheckerProps = Checker & {
    handleDragStart: (e: DragEvent, checker: Checker) => void;
    onCheckerClick: (check: Checker) => void;
};

const Check = ({
    check_id,
    column,
    unite_id,
    order_id,
    item_id,
    item_qty,
    reason,
    date_check,
    date_exp,
    handleDragStart,
    onCheckerClick,
}: CheckerProps) => {
    return(
        <>
        <DropIndicator beforeId={check_id} column={column} />
        <motion.div
            layout
            layoutId={check_id}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, {  check_id,column,unite_id,
                order_id,
                item_id,
                item_qty,
                reason,
                date_check,
                date_exp })}
            onClick={() => onCheckerClick({
                check_id, column,
                unite_id,
                order_id,
                item_id,
                item_qty,
                reason,
                date_check,
                date_exp
            })}
            className="cursor-grab shadow-lg shadow-slate-900 rounded border-dashed border-white border-2 bg-neutral-800 hover:bg-gray-700 p-3 active:cursor-grabbing"
        >
            <p className="text-sm  text-neutral-100"> Item ID: {check_id} | Status: {column}</p>
        </motion.div>
        </>
    )
}
type DropIndicatorProps = {
beforeId: string | null;
column: string;
};
const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
return (
    <div
    data-before={beforeId || "-1"}
    data-column={column}
    className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
);
};

const BurnBarrel = ({
    setChecker,
  }: {
    setChecker: Dispatch<SetStateAction<Checker[]>>;
  }) => {
    const [active, setActive] = useState(false);
  
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setActive(true);
    };
  
    const handleDragLeave = () => {
      setActive(false);
    };
  
    const handleDragEnd = (e: DragEvent) => {
      const checkerId = e.dataTransfer.getData("checkerId");
  
      setChecker((pv) => pv.filter((c) => c.check_id !== checkerId));
  
      setActive(false);
    };
    return(
        <div
            onDrop={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
            active
            ? "border-red-800 bg-red-800/20 text-red-500"
            : "border-neutral-500 bg-neutral-500/20 text-neutral-700"
        }`}
        >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
        </div>
    )
}

type ModalProps = {
    check: Checker;
    onClose: () => void;
};
const Modal = ({ check, onClose }: ModalProps) => {
    return (
        <div
        className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75"
        onClick={onClose}
        >
        <div
            className="bg-neutral-800 p-6 rounded-lg w-96"
            onClick={(e) => e.stopPropagation()}
        >
            <h2 className="text-xl font-bold text-neutral-50">ID : {check.item_id}</h2>
            <p className="text-neutral-300 my-2">Column: {check.column}</p>
            <p className="text-neutral-300 my-2">Unit ID : {check.unite_id}</p>
            <p className="text-neutral-300 my-2">Quantity: {check.item_qty} unit</p>
            <p className="text-neutral-300 my-2">Date Check: {check.date_check}</p>
            <p className="text-neutral-300 my-2">Data Expire {check.date_exp}</p>
            <p className="text-neutral-300 my-2">Reason: {check.reason}</p>
            <button className="mt-4  rounded bg-green-600 hover:bg-green-700 px-4 py-2 text-neutral-50">
                Edite
            </button>
            <button
            onClick={onClose}
            className="mt-4 rounded ml-4 bg-red-600 hover:bg-red-700 px-4 py-2 text-neutral-50"
            >
            Close
            </button>
        </div>
        </div>
    );
};