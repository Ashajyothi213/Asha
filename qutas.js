import { Builder, By, Key, until } from 'selenium-webdriver';
import { expect } from 'chai';

describe('Qantas Website UI Tests', function () {
  let driver;
  this.timeout(60000);

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    await driver.get('https://www.qantas.com/au/en.html');
  });
  it('should allow searching for flights from Sydney to Melbourne', async () => {
    await driver.get('https://www.qantas.com/au/en.html'),20000
    const fromBtn = await driver.findElement(By.xpath("//button[@aria-haspopup='dialog']//span[text()='From']"));
    await fromBtn.click();

    const fromInput = await driver.wait(
      until.elementLocated(By.xpath("//input[@placeholder='Type a city name or airport code']")),
      10000
    );
    await fromInput.sendKeys('Sydney');
    await driver.wait(until.elementLocated(By.css('data-testid="suggestion-list"]')), 20000);
    const firstSuggestion = await driver.wait(
      until.elementLocated(By.css('.autocomplete__list-item')),
      10000
    );
    await firstSuggestion.click();

    // You can assert the selected value or continue with other actions
    const selectedValue = await fromInput.getAttribute('value');
    console.log('Selected From:', selectedValue);
    


    const toBtn = await driver.findElement(By.xpath("//button[@aria-haspopup='dialog']//span[text()='From']"));
    await toBtn.click();

    const toInput = await driver.wait(
      until.elementLocated(By.xpath("//input[@placeholder='Type a city name or airport code']")),
      10000
    );
    await toInput.sendKeys('Sydney');
    await driver.wait(until.elementLocated(By.css('data-testid="suggestion-list"]')), 20000);
    const secondSuggestion = await driver.wait(
      until.elementLocated(By.css('.autocomplete__list-item')),
      10000
    );
    await secondSuggestion.click();

    // You can assert the selected value or continue with other actions
    const selectedValueforto = await toInput.getAttribute('value');
    console.log('Selected From:', selectedValue);
    const seachBtn = await driver.findElement(By.xpath("//*[@data-testid='search-flights-btn']"));
    await seachBtn.click();

    it('should show valid flight search results from Sydney to Melbourne', async () => {
      // Accept cookie banner if present
      try {
        const cookieBtn = await driver.wait(until.elementLocated(By.css('[data-testid="cookie-banner-accept-button"]')), 5000);
        await cookieBtn.click();
      } catch (err) {
        console.log('No cookie banner');
      }
  
      // Fill From field
      const fromInput = await driver.wait(until.elementLocated(By.id('autocomplete-origin')), 10000);
      await fromInput.click();
      await fromInput.sendKeys('Sydney');
      const fromSuggestion = await driver.wait(until.elementLocated(By.css('.autocomplete__list-item')), 10000);
      await fromSuggestion.click();
  
      // Fill To field
      const toInput = await driver.findElement(By.id('autocomplete-destination'));
      await toInput.click();
      await toInput.sendKeys('Melbourne');
      const toSuggestion = await driver.wait(until.elementLocated(By.css('.autocomplete__list-item')), 10000);
      await toSuggestion.click();
  
      // Click Search
      const searchBtn = await driver.wait(until.elementLocated(By.css('[data-testid="search-button"]')), 10000);
      await searchBtn.click();
  
      // Wait for results page to load
      await driver.wait(until.urlContains('flights/results'), 20000);
  
      // Assert: Flight results are displayed
      const flightCards = await driver.wait(
        until.elementsLocated(By.css('[data-testid="itinerary-card"]')),
        20000
      );
      expect(flightCards.length).to.be.above(0, 'No flight results found');
  
      // Optional: Assert route info shows Sydney → Melbourne
      const summary = await driver.findElement(By.css('[data-testid="search-summary-header"]')).getText();
      expect(summary).to.include('Sydney');
      expect(summary).to.include('Melbourne');


  });
});






























































  