import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import { REQUIRED_ELEMENT_CITATION_ELEMENTS } from '../../src/constants'

// TODO: export all trafos via index.es.js, and import {..} from '../../index.es.js'
import ConvertElementCitation from '../../src/converter/r2t/ConvertElementCitation'
const test = module('Element Citation Converter')
import readFixture from '../fixture/readFixture'
let fixture = readFixture('element-citation.xml')

test("r2t: Import content-loc", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertElementCitation()
  converter.import(dom)

  let r1 = dom.find('#r1')
  let contentLoc = r1.find('content-loc')
  // fpage,lpage,page-range should be wrapped in content-loc
  t.equal(contentLoc.attr('type'), 'print', 'Should have a print content-loc')
  t.ok(contentLoc.find('fpage'), 'contentLoc should have an fpage')
  t.ok(contentLoc.find('lpage'), 'contentLoc should have an lpage')
  t.ok(contentLoc.find('page-range'), 'empty page-range element should have been created')
  t.end()
})

test("r2t: Create empty elements on import if not present", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertElementCitation()
  converter.import(dom)
  let r1 = dom.find('#r1')
  // should have all possible elements expanded
  t.ok(_hasElements(r1, REQUIRED_ELEMENT_CITATION_ELEMENTS), 'should have all required elements expanded')
  t.end()
})

test("r2t: Fill in missing pub-ids for journal publication", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertElementCitation()
  converter.import(dom)

  let r1 = dom.find('#r1')
  let doi = r1.find('pub-id[pub-id-type=doi]')
  let pmid = r1.find('pub-id[pub-id-type=pmid]')

  t.ok(doi, 'doi should be present')
  t.ok(pmid, 'pmid should be present')
  t.end()
})

test("r2t: Strip empty elements on export", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertElementCitation()
  converter.import(dom)
  converter.export(dom)
  let r1 = dom.find('#r1')
  let issue = r1.find('issue')
  t.notOk(issue, 'Should not have an empty issue element after export')
  t.end()
})

function _hasElements(el, elements) {
  let result = true
  elements.forEach((element) => {
    let [tagName, attrib, attribVal] = element
    let matcher = tagName
    if (attrib) {
      matcher = `${tagName}[${attrib}=${attribVal}]`
    }
    if (!el.find(matcher)) {
      result = false
    }
  })
  return result
}
