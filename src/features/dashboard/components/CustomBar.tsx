import { Rectangle } from "recharts";
import { getColorByIndex } from "../../../shared/utils/chartColors";

type CustomBarProps = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    index?: number;
};

export default function CustomBar(props: CustomBarProps) {
    const { x, y, width, height, index = 0 } = props;

    if (width === undefined || height === undefined || width <= 0 || height <= 0) return null;

    return (
        <Rectangle
            x={x}
            y={y}
            width={width}
            height={height}
            fill={getColorByIndex(index)}
            radius={[6, 6, 0, 0]} // bordes redondeados arriba
        />
    );
}