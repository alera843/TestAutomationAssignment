const { By, Builder, Key, Capabilities, until} = require('selenium-webdriver');
const { suite } = require('selenium-webdriver/testing');
const assert = require("assert");
const data = require('./config.json');
const { doesNotMatch } = require('assert');
const chrome = require('selenium-webdriver/chrome');
const { elementLocated } = require('selenium-webdriver/lib/until');
const itParam = require('mocha-param').itParam;

let driver;
suite(function() {
    describe('First script', function() {

        before(async function() {
            driver = await new Builder().forBrowser(data.SELENIUM_BROWSER).build();
        });

        after(() => driver.quit());

        const contactMails = [
            'sdfsdf.dg',
            'somename@#@$#^$%&$%&.com',
            '$@#$@#$@#$#@%',
            'test@test',
            'frewfwef.yahoo.com'
        ]

        itParam('Test Case 1 - invalid mail error', contactMails, async function(email) {
            await driver.get(data.BASE_URL);
            let title = await driver.getTitle();
            assert.equal("Musala Soft", title);
            await driver.executeScript("document.getElementsByClassName('contact-label')[0].scrollIntoView()" , "");   
            let contactUs = await driver.findElement(By.className('contact-label btn btn-1b'));
            await contactUs.click();
            let nameField = await driver.findElement(By.name('your-name'));
            await nameField.sendKeys('Ala Bala');
            let subjectField = await driver.findElement(By.name('your-subject'));
            await subjectField.sendKeys('Subject: Ala Bala');
            let messageField = await driver.findElement(By.name('your-message'));
            await messageField.sendKeys('Message: Ala Bala');
            let emailField = await driver.findElement(By.name('your-email'));
            await emailField.sendKeys(email);
            let sendButton = await driver.findElement(By.xpath("//input[@type='submit'][@value = 'Send']"));
            await sendButton.click();
            let invalidMail = await driver.wait(until.elementLocated(By.className('wpcf7-not-valid-tip')), 1000);
            let errorText = await invalidMail.getText();
            assert.equal("The e-mail address entered is invalid.", errorText);
        });

        it('Test Case 2 - leadership & facebook', async function() {
            await driver.get(data.BASE_URL);
            await driver.wait(until.titleIs('Musala Soft'), 10000);
            await driver.executeScript("window.scrollTo(0,0)" , "");
            await driver.findElement(By.xpath("//div[@id='menu']/ul[@id='menu-main-nav-1']/li[1]/a")).click();
            await driver.wait(until.titleIs('Musala Soft | Musala Soft'), 1000);
            let companyURL = await driver.getCurrentUrl();
            assert.equal("https://www.musala.com/company/", companyURL);
            let leadership = 
            await driver.findElement(By.xpath("//section[@class='company-members']/div[@class='cm-content']/h2"));
            let membersHeading = await leadership.getText();
            assert.equal("Leadership", membersHeading);
            let consent = await driver.findElement(By.id('wt-cli-accept-all-btn'));
            await consent.click();
            let originalWindow = await driver.getWindowHandle();
            assert((await driver.getAllWindowHandles()).length === 1);
            let facebookIcon = await driver.findElement(By.className('musala musala-icon-facebook'));
            await facebookIcon.click();
            await driver.wait(
                async () => (await driver.getAllWindowHandles()).length === 2,
                10000
              );
            let windows = await driver.getAllWindowHandles();
            windows.forEach(async handle => {
                if (handle !== originalWindow) {
                  await driver.switchTo().window(handle);
                }
              });
            await driver.wait(until.titleIs('Musala Soft - Home | Facebook'), 10000);
            let facebookURL = await driver.getCurrentUrl();
            assert.equal("https://www.facebook.com/MusalaSoft?fref=ts", facebookURL);
            await driver.findElement(By.xpath("//div[@aria-label='Only allow essential cookies']")).click();
            await driver.wait(until.elementLocated(By.xpath("//a[@aria-label = 'Musala Soft profile photo']")), 1000);
            let profileImage = await driver.findElement(By.xpath("//a[@aria-label = 'Musala Soft profile photo']")).isDisplayed();
            assert.equal(1, profileImage);
        });

        it('Test Case 3 - careers apply error', async function() {
            await driver.get(data.BASE_URL);
            //Menu is not clickable before the page loads. Wait until page title is displayed.
            await driver.wait(until.titleIs('Musala Soft'), 10000);
            await driver.executeScript("window.scrollTo(0,0)" , "");
            let careers = await driver.findElement(By.xpath("//div[@id='menu']/ul[@id='menu-main-nav-1']/li[5]/a"));
            await careers.click();
            await driver.wait(until.titleIs('Careers | Musala Soft'), 1000);
            await driver.findElement(By.className('contact-label contact-label-code btn btn-1b')).click();
            await driver.wait(until.titleIs('Join Us | Musala Soft'), 1000);
            let joinUsURL = await driver.getCurrentUrl();
            assert.equal('https://www.musala.com/careers/join-us/', joinUsURL);
            await driver.findElement(By.id('get_location')).click();
            await driver.findElement(By.xpath("//select[@id='get_location']/option[@value='Anywhere']")).click();
            await driver.findElement(By.xpath("//div[@class='card']/div[@class='front']/h2[contains(text(), 'Automation QA Engineer')]")).click();
            await driver.wait(until.titleIs('Automation QA Engineer | Musala Soft'), 1000);
            let description = 
            await driver.findElement(By.xpath("//div[@class='requirements pull-right']/div[@class='content-title']/h2[contains(text(), 'General description')]")).isDisplayed();
            assert.equal(1, description);
            if (description) {
                console.log('The description is displayed')
            };
            let requirements = 
            await driver.findElement(By.xpath("//div[@class='requirements pull-left']/div[@class='content-title']/h2[contains(text(), 'Requirements')]")).isDisplayed();
            assert.equal(1, requirements);
            if (requirements) {
                console.log('The requirements are displayed')
            };
            let responsibilities = 
            await driver.findElement(By.xpath("//div[@class='requirements pull-right']/div[@class='content-title']/h2[contains(text(), 'Responsibilities')]")).isDisplayed();
            assert.equal(1, responsibilities);
            if (responsibilities) {
                console.log('The responsibilities are displayed')
            };
            let offer = 
            await driver.findElement(By.xpath("//div[@class='requirements pull-left']/div[@class='content-title']/h2[contains(text(), 'What we offer')]")).isDisplayed();
            assert.equal(1, offer);
            if (offer) {
                console.log('The offer is displayed')
            };
            await driver.executeScript("document.getElementsByClassName('btn-apply')[0].scrollIntoView()" , "");
            await driver.findElement(By.className('btn-apply')).click();
            let uploadCv = await driver.findElement(By.name('upload-cv'));
            await uploadCv.sendKeys(process.cwd()+'/sample.pdf');
            let applyName = await driver.wait(until.elementLocated(By.xpath("//span[@data-name='your-name']/span[@class='wpcf7-not-valid-tip']")), 1000);
            let errorTextName = await applyName.getText();
            assert.equal("The field is required.", errorTextName);
            let applyMail = await driver.wait(until.elementLocated(By.xpath("//span[@data-name='your-email']/span[@class='wpcf7-not-valid-tip']")), 1000);
            let errorTextMail = await applyMail.getText();
            assert.equal("The field is required.", errorTextMail);
        });

        it('Test Case 4 - print available positions - Sofia/Skopje', async function() {
            await driver.get(data.BASE_URL);
            await driver.executeScript("window.scrollTo(0,0)" , "");
            await driver.findElement(By.xpath("//div[@id='menu']/ul[@id='menu-main-nav-1']/li[5]/a")).click();
            await driver.wait(until.titleIs('Careers | Musala Soft'), 10000);
            await driver.findElement(By.className('contact-label contact-label-code btn btn-1b')).click();
            await driver.wait(until.titleIs('Join Us | Musala Soft'), 10000);
            await listPositionsByCity('Sofia');
            await listPositionsByCity('Skopje');
        });
    });
});


async function listPositionsByCity(city) {
    await driver.findElement(By.id('get_location')).click();
    await driver.findElement(By.xpath("//select[@id='get_location']/option[@value='"+city+"']")).click();
    console.log(city);
    let positions = await driver.findElements(By.className('card-container'));
    for (let position of positions) {
        let thisCity = await position.findElement(By.className('card-jobsHot__location')).getText();
        if (thisCity != city) {
            continue;
        }
        let title = await position.findElement(By.tagName('h2'));
        let titleText = await title.getText();
        console.log('Position: ', titleText)
        let positionLink = await position.findElement(By.tagName('a'));
        let link = await positionLink.getAttribute('href');
        console.log('More info: ', link)
    };

}