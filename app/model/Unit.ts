type Unit = {
	name: string;
	nextHigherUnitName?: string | undefined;
	amountForNextHigherUnit?: number | undefined;
};

export default Unit;
