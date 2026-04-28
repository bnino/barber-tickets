type TooltipPayloadItem = {
    payload: {
        count?: number;
        value?: number;
    };
};

type Props = {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
};

export default function ChartTooltip({ active, payload, label }: Props) {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;

    return (
        <div className="bg-white p-3 rounded shadow text-sm border">
            <p className="font-semibold">{label}</p>

            {data.count !== undefined && (
                <p>Servicios: {data.count}</p>
            )}

            {data.value !== undefined && (
                <p>Ingresos: ${data.value.toLocaleString()}</p>
            )}
        </div>
    );
}