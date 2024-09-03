'use client'

export function InputDropDown(props : {idName: string,listValue : string[],label : string,selected : string, onChange: React.ChangeEventHandler<HTMLInputElement>})
{
    return (
        <div className="relative z-0 w-full mb-5 group">
            <label htmlFor={props.idName}
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {props.label}
            </label>
            <select id={props.idName}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
                <option selected>{props.selected}</option>
                {props.listValue.map((value) => (
                    <option key={value} value={value}>{value}</option>
                ))}
            </select>
        </div>

    );
}