
/// <reference path="../coalesce.dependencies.d.ts" />

// Generated by IntelliTect.Coalesce

module ViewModels {
    
    /** External Type Location */
    export class Location {
        public parent: any;
        public parentCollection: any;
        
        // Observables
        public city: KnockoutObservable<string | null> = ko.observable(null);
        public state: KnockoutObservable<string | null> = ko.observable(null);
        public zip: KnockoutObservable<string | null> = ko.observable(null);
        
        /** 
            Load the object from the DTO.
            @param data: The incoming data object to load.
        */
        public loadFromDto = (data: any) => {
            if (!data) return;
            
            // Load the properties.
            this.city(data.city);
            this.state(data.state);
            this.zip(data.zip);
            
        };
        
        /** Saves this object into a data transfer object to send to the server. */
        public saveToDto = (): any => {
            var dto: any = {};
            
            dto.city = this.city();
            dto.state = this.state();
            dto.zip = this.zip();
            
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
