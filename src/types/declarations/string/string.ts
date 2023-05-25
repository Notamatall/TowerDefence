interface String {
	toProperCase(): string;
	bool(): boolean;
}

String.prototype.toProperCase = function (): string {
	return this.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())
}

String.prototype.bool = function (): boolean {
	return this.toLowerCase() == 'true';
};
