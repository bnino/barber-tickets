import { Rectangle } from "recharts";
import { getColorByIndex } from "../../../shared/utils/chartColors";

export default function CustomBar(props: any) {
    const { x, y, width, height, index } = props;

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