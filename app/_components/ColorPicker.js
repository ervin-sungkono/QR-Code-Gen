export default function ColorPicker({ label, id, defaultValue, onChange }){
    return(
        <div className="flex flex-col">
            {label && <label htmlFor={id} className="text-sm font-semibold mb-1">
                {label}
            </label>}
            <input 
                id={id}
                type="color" 
                defaultValue={defaultValue} 
                onChange={onChange}
                className="w-16 h-8"
            />
        </div>
    )
}