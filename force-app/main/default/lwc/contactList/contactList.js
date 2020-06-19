import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord } from 'lightning/uiRecordApi';
import getContactsWithAccountName from '@salesforce/apex/ContactController.getContactsWithAccountName';


const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Email', fieldName: 'Email' },
    { label: 'Account Name', fieldName: 'AccountName' },
    {
        type:  'button',
        typeAttributes: 
        {
            iconName: 'utility:delete',
            label: 'Delete', 
            name: 'deleteContact', 
            title: 'deleteTitle', 
            disabled: false, 
            value: 'test'
        }
    }
];

export default class contactList extends LightningElement {
    contacts;
    error;
    @track data = [];
    columns = columns;
    ready;


    /** Wired Apex result so it can be refreshed programmatically */
    wiredContactsResult;

    @wire(getContactsWithAccountName)
    wiredContacts(result) {
        this.wiredContactsResult = result;
        var tempArray =[];
        if (result.data) {
            this.contacts = result.data;
            this.error = undefined;
            for (let index = 0; index < this.contacts.length; index++) {
                var element = new Object();
                element.Id = this.contacts[index].Id;
                element.Name = this.contacts[index].Name;
                element.Email = this.contacts[index].Email;
                if(this.contacts[index].Account){
                    console.log(JSON.stringify(element));
                    element.AccountName = this.contacts[index].Account.Name;
                }
                console.log(JSON.stringify(element));
                tempArray[index] = element;    
            }
        } else if (result.error) {
            this.error = result.error;
            this.contacts = undefined;
        }
        this.data = tempArray;
        //console.log(JSON.stringify(this.contacts));
        this.ready = true;
    }

    deleteContact(event) {
        const recordId = event.detail.row.Id;
        deleteRecord(recordId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact deleted',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredContactsResult);
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: reduceErrors(error).join(', '),
                        variant: 'error'
                    })
                );
            });
    }
    handleChange(event){
        alert(JSON.stringify(event.detail.selectedRows[0].Name+ " selected"));
    }
}