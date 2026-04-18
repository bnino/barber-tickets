import ChartTooltip from "../../../shared/components/ChartTooltip";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

type Props = {
    data: { label: string; value: number }[];
};

export default function IncomeChart({ data }: Props) {
    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Ingresos</h3>

            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip content={<ChartTooltip />} />
                    <Line type="monotone" dataKey="value" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}