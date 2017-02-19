describe('angularjs users list', function() {
  it('should add a user', function() {
    browser.get('http://localhost:3030/');

    const email = 'User1@users.org';
    name = 'User1 Lastnameson';
    //when 
    element(by.model('formData.name')).sendKeys(name);
    element(by.model('formData.email')).sendKeys(email);
    element(by.model('formData.address')).sendKeys('user street 17, New Oreleans');
    element(by.model('formData.birthday')).sendKeys('1933-03-03');
    element(by.id('add')).click();

    var deletebutton_for_the_new_user = element(by.id(email));
    expect(deletebutton_for_the_new_user.getText()).toEqual("Delete");

    //cleanup
    deletebutton_for_the_new_user.click();
  });
});