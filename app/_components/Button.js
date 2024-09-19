export default function Button({ disabled, onClick }){
    return(
        <button 
            className="bg-blue-600 text-white py-2 hover:bg-blue-600/80 rounded disabled:bg-slate-400 font-semibold" 
            disabled={disabled} 
            onClick={onClick}
        >
            Download QR
        </button>
    )
}