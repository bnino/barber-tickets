type Props = {
    filter: string;
    setFilter: (f: any) => void;
};

export default function FilterTabs({ filter, setFilter }: Props) {
    const tabs = [
        { label: "Hoy", value: "today" },
        { label: "Esta Semana", value: "week" },
        { label: "Ult. 7 Dias", value: "lastSevenDays" },
        { label: "Este Mes", value: "month" }
    ];

    return (
        <div className="inline-flex bg-white p-1 rounded-xl shadow-sm border">
            {tabs.map(tab => (
                <button
                    key={tab.value}
                    onClick={() => setFilter(tab.value)}
                    className={`
                        px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition
                        ${filter === tab.value
                            ? "bg-gray-900 text-white shadow"
                            : "text-gray-600 hover:bg-gray-100"}
                    `}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}