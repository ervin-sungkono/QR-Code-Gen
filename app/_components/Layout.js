export default function Layout({children}){
    return(
        <div className="flex fixed top-0 left-0 bottom-0 right-0">
            <div className="max-h-full flex flex-col flex-grow mx-auto overflow-y-auto">
                {children}
            </div>
        </div>
    )
}