export default class IocManager{
    static _instance: IocManager = null ;
    _singletons: any[];

    private constructor() {
        this._singletons = [];
    }

    public static GetInstance(): IocManager{
        if(this._instance === null){
            this._instance = new IocManager();
        }
        return this._instance;
    }

    public RegisterSingleton(name:string, obj: any): void{
        let objExist = this.GetSingleton(name);
        if(objExist === null){
            this._singletons.push({
                name,
                obj
            })
        } else{
            console.error(`Singleton ${name} already register`);
        }
    }

    public GetSingleton(name:string): any{
        let obj = this._singletons.filter(value => value.name === name)
        return obj.length === 1 ? obj[0].obj : null;
    }
}
