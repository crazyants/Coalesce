
/// <reference path="../coalesce.dependencies.d.ts" />

// Knockout View Model for: CaseDto
// Auto Generated by IntelliTect.Coalesce

module ViewModels {

	export class CaseDto extends Coalesce.BaseViewModel
    {
        protected modelName = "CaseDto";
        protected primaryKeyName = "caseId";
        protected modelDisplayName = "Case Dto";

        protected apiController = "/CaseDto";
        protected viewController = "/CaseDto";

        /** Behavioral configuration for all instances of CaseDto. Can be overidden on each instance via instance.coalesceConfig. */
        public static coalesceConfig: Coalesce.ViewModelConfiguration<CaseDto>
            = new Coalesce.ViewModelConfiguration<CaseDto>(Coalesce.GlobalConfiguration.viewModel);

        /** Behavioral configuration for the current CaseDto instance. */
        public coalesceConfig: Coalesce.ViewModelConfiguration<CaseDto>
            = new Coalesce.ViewModelConfiguration<CaseDto>(CaseDto.coalesceConfig);
    
        /** 
            The namespace containing all possible values of this.dataSource.
        */
        public dataSources = ListViewModels.CaseDtoDataSources;

        /**
            The data source on the server to use when retrieving the object.
            Valid values are in this.dataSources.
        */
        public dataSource: Coalesce.DataSource<CaseDto>;
    

        public caseId: KnockoutObservable<number> = ko.observable(null);
        public title: KnockoutObservable<string> = ko.observable(null);
        public assignedToName: KnockoutObservable<string> = ko.observable(null);

       
        






        /** 
            Load the ViewModel object from the DTO. 
            @param force: Will override the check against isLoading that is done to prevent recursion. False is default.
            @param allowCollectionDeletes: Set true when entire collections are loaded. True is the default. In some cases only a partial collection is returned, set to false to only add/update collections.
        */
        public loadFromDto = (data: any, force: boolean = false, allowCollectionDeletes: boolean = true) => {
            if (!data || (!force && this.isLoading())) return;
            this.isLoading(true);
            // Set the ID 
            this.myId = data.caseId;
            this.caseId(data.caseId);
            // Load the lists of other objects
            // Objects are loaded first so that they are available when the IDs get loaded.
            // This handles the issue with populating select lists with correct data because we now have the object.

            // The rest of the objects are loaded now.
            this.title(data.title);
            this.assignedToName(data.assignedToName);
            if (this.coalesceConfig.onLoadFromDto()){
                this.coalesceConfig.onLoadFromDto()(this as any);
            }
            this.isLoading(false);
            this.isDirty(false);
    
            if (this.coalesceConfig.validateOnLoadFromDto()) this.validate();
        };
    
        /** Saves this object into a data transfer object to send to the server. */
        public saveToDto = (): any => {
            var dto: any = {};
            dto.caseId = this.caseId();

            dto.title = this.title();

            return dto;
        }
    
        /**
            Loads any child objects that have an ID set, but not the full object.
            This is useful when creating an object that has a parent object and the ID is set on the new child.
        */
        public loadChildren = (callback?: () => void) => {
            var loadingCount = 0;
            if (loadingCount == 0 && $.isFunction(callback)){
                callback();
            }
        };
        
        public setupValidation = () => {
            if (this.errors !== null) return;
            this.errors = ko.validation.group([
            ]);
            this.warnings = ko.validation.group([
            ]);
        }
    
        // Computed Observable for edit URL
        public editUrl = ko.pureComputed(() => {
            return this.coalesceConfig.baseViewUrl() + this.viewController + "/CreateEdit?id=" + this.caseId();
        });

        constructor(newItem?: any, parent?: any){
            super();
            this.baseInitialize();
            var self = this;
            self.parent = parent;
            self.myId;

            // Create computeds for display for objects

    



            // This stuff needs to be done after everything else is set up.
            self.title.subscribe(self.autoSave);
        
            if (newItem) {
                if ($.isNumeric(newItem)) self.load(newItem);
                else self.loadFromDto(newItem, true);
            }
        }
    }





    export namespace CaseDto {

        // Classes for use in method calls to support data binding for input for arguments
    }
}