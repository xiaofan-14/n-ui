export interface pluginProps {
    rmFiles?: string[];
    beforeBuild?: Function;
    afterBuild?: Function;
}
export default function hooksPlugin(props: pluginProps): {
    name: string;
    buildStart(): void;
    buildEnd(err?: Error): void;
};
