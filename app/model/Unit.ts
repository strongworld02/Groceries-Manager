type Unit = {
	name: string;
	displayName: string;
	nextHigherUnitName?: string | undefined;
	amountForNextHigherUnit?: number | undefined;
};

export default Unit;
