@isTest
public with sharing class TestContactController {
    public static void createContacts(Integer amount) {
        List<Contact> contacts = new List<Contact>();
        
        for (Integer i = 1; i <= amount; i++) {
            contacts.add(
                new Contact(
                    FirstName = 'First ' + i,
                    LastName = 'Last ' + i
                )
            );
        }

        insert contacts;
    }

    @isTest
    static void getContactsWithAccountNameTest() {
        TestContactController.createContacts(10);

        Test.startTest();
        List<Contact> conts = ContactController.getContactsWithAccountName();
        Test.stopTest();

        System.assertEquals(conts.size(), 10);
    }
}
