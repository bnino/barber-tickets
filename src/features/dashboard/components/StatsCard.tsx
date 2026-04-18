type Props = {
    title: string;
    value: string;
};

export default function StatsCard({ title, value }: Props) {
    return (
        <div className="
            bg-white rounded-2xl shadow-sm border
            p-5 hover:shadow-md transition">
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
    );
}