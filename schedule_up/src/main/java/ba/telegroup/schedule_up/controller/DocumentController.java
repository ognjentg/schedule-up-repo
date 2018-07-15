package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Document;
import ba.telegroup.schedule_up.repository.DocumentRepository;
import ba.telegroup.schedule_up.util.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@RequestMapping(value = "/document")
@Controller
@Scope("request")
public class DocumentController extends GenericController<Document, Integer> {


    private final DocumentRepository documentRepository;

    @Value("${badRequest.insert}")
    private String badRequestInsert;

    @Value("${badRequest.stringMaxLength}")
    private String badRequestStringMaxLength;

    @Value("${longblob.length}")
    private Long longblobLength;

    @Value("${badRequest.binaryLength}")
    private String badRequestBinaryLength;

    @Value("${badRequest.numberNotNegative}")
    private String badRequestNumberNotNegative;

    @Value("${badRequest.update}")
    private String badRequestUpdate;

    @Autowired
    public DocumentController(DocumentRepository repo) {
        super(repo);
        this.documentRepository = repo;
    }

    @Transactional
    @RequestMapping(value = "/list/", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    List<Document> insertDocuments(@RequestBody List<Document> documents) throws BadRequestException {
        List<Document> retDocuments = new ArrayList<>();
        if (documents == null || documents.size() == 0) {
            throw new BadRequestException(badRequestInsert);
        } else {
            for (Document document : documents) {
                if(Validator.stringMaxLength(document.getName(), 100)) {
                    if(Validator.binaryMaxLength(document.getContent(), longblobLength)) {
                        if(Validator.integerNotNegative((int)document.getReport())) {
                            retDocuments.add(documentRepository.saveAndFlush(document));
                            continue;
                        }
                        throw new BadRequestException(badRequestNumberNotNegative.replace("{tekst}", "izvjestaj"));
                    }
                    throw new BadRequestException(badRequestBinaryLength.replace("{tekst}", "sadrzaja"));
                }
                throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));
            }
            return retDocuments;
        }
    }


    @RequestMapping(value = "/getAllByIdIsAfter/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<Document> getAllByIdIsAfter(@PathVariable Integer id) {
        return documentRepository.getAllByIdIsAfter(id);
    }

    @RequestMapping(value = "/getAllByIdIsBefore/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<Document> getAllByIdIsBefore(@PathVariable Integer id) {
        return documentRepository.getAllByIdIsBefore(id);
    }

    @RequestMapping(value = "/getAllByNameContains/{name}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByNameContains(@PathVariable String name) {
        List<Document> documents = documentRepository.getAllByNameContains(name);
        return new ArrayList<>(documents);
    }

    @RequestMapping(value = "/getAllByMeetingId/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByMeetingId(@PathVariable Integer id) {
        List<Document> documents = documentRepository.getAllByMeetingId(id);
        return new ArrayList<>(documents);
    }

    @Transactional
    @RequestMapping(value = "/updateAll/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    List<Document> updateDocuments(@RequestBody List<Document> documents, @PathVariable Integer id) throws ForbiddenException, BadRequestException {
        for(Iterator<Document> it = documents.iterator(); it.hasNext();) {
            Document document = it.next();
            if(Validator.stringMaxLength(document.getName(), 100)) {
                if (Validator.binaryMaxLength(document.getContent(), longblobLength)) {
                    if (Validator.integerNotNegative((int) document.getReport())) {
                        continue;
                    }
                    throw new BadRequestException(badRequestNumberNotNegative.replace("{tekst}", "izvjestaj"));
                }
                throw new BadRequestException(badRequestBinaryLength.replace("{tekst}", "sadrzaja"));
            }
            throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));
        }

            List<Document> currentDocuments = getAllByMeetingId(id);
            for (Iterator<Document> it = currentDocuments.iterator(); it.hasNext(); ) {
                Document document = it.next();
                if (!documents.contains(document)) {
                    delete(document.getId());
                    it.remove();
                }
            }

            documents.removeAll(currentDocuments);
            documents = insertDocuments(documents);
            documents.addAll(currentDocuments);
            return documents;
    }
}