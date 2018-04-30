
/// <reference path="../coalesce.dependencies.d.ts" />

// Generated by IntelliTect.Coalesce

module ViewModels {
    
    /** External Type CaseSummary */
    export class CaseSummary {
        public parent: any;
        public parentCollection: any;
        
        // Observables
        public caseSummaryId: KnockoutObservable<number | null> = ko.observable(null);
        public openCases: KnockoutObservable<number | null> = ko.observable(null);
        public caseCount: KnockoutObservable<number | null> = ko.observable(null);
        public closeCases: KnockoutObservable<number | null> = ko.observable(null);
        public description: KnockoutObservable<string | null> = ko.observable(null);
        
        /** 
            Load the object from the DTO.
            @param data: The incoming data object to load.
        */
        public loadFromDto = (data: any) => {
            if (!data) return;
            
            // Load the properties.
            this.caseSummaryId(data.caseSummaryId);
            this.openCases(data.openCases);
            this.caseCount(data.caseCount);
            this.closeCases(data.closeCases);
            this.description(data.description);
            
        };
        
        /** Saves this object into a data transfer object to send to the server. */
        public saveToDto = (): any => {
            var dto: any = {};
            
            dto.caseSummaryId = this.caseSummaryId();
            dto.openCases = this.openCases();
            dto.caseCount = this.caseCount();
            dto.closeCases = this.closeCases();
            dto.description = this.description();
            
            return dto;
        }
        
        constructor(newItem?: any, parent?: any) {
            this.parent = parent;
            
            if (newItem) {
                this.loadFromDto(newItem);
            }
        }
    }
}
