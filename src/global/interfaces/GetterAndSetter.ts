export default interface GetterAndSetter {
	get: () => any;
	set: (newValue: any) => void;
}