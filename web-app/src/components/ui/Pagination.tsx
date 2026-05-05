interface PaginationProps {
    prevPage: () => void;
    nextPage: () => void;
    currentPage: number;
    onChangeTotalPages: (page: number) => void;
}

export const Pagination = (props: PaginationProps) => {
    return (
        <div className="">
            <div className="mt-5 flex justify-center">
                <p className="text-gray-800 text-xl inline"
                    onClick={props.prevPage}
                > {"<"} </p>
                <p className="text-gray-900 text-xl inline mr-2 ml-2"> {props.currentPage} </p>
                <p className="text-gray-800 text-xl inline "
                    onClick={props.nextPage}
                > {">"} </p>
            </div>
            <div className="">
                <div className="">
                    <p className="text-gray-600 text-sm inline mr-1">Page size: </p>
                    <input
                        type="text"
                        placeholder= "20"
                        className="bg-white rounded-2xl shadow-sm p-2 pl-3 mt-2 mb-3 inline w-11
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => props.onChangeTotalPages(parseInt(e.target.value))}
                    />
                </div>
            </div>
        </div>
    );
}