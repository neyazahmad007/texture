import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import ConvertFig from '../../src/converter/r2t/ConvertFig'

const test = module('Normalize fig')
import readFixture from '../fixture/readFixture'
let fixture = readFixture('fig.xml')

test("r2t: Extract caption title from figure", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertFig()
  converter.import(dom)
  let fn = dom.find('#fig1')
  // title should now be child of fig, and caption a container of paragraphs
  t.equal(fn.outerHTML, '<fig id="fig1"><title>fig_title</title><caption><p>fig_caption</p></caption><graphic xlink:href="fig1.jpg"/></fig>')
  t.end()
})

test("r2t: Should expand title and caption if not there", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertFig()
  converter.import(dom)
  let fn = dom.find('#fig2')
  // should create title and caption if does not exist
  t.equal(fn.outerHTML, '<fig id="fig2"><title></title><caption><p></p></caption><graphic xlink:href="fig2.jpg"/></fig>')
  t.end()
})


test("r2t: Should expand title if not there", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertFig()
  converter.import(dom)
  let fn = dom.find('#fig2')
  // should create title and caption if does not exist
  t.equal(fn.outerHTML, '<fig id="fig3"><title></title><caption><p>fig_caption</p></caption><graphic xlink:href="fig3.jpg"/></fig>')
  t.end()
})