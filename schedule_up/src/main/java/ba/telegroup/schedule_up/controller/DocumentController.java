package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Document;
import ba.telegroup.schedule_up.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequestMapping(value = "/document")
@Controller
@Scope("request")
public class DocumentController extends GenericController<Document, Integer> {

    private DocumentRepository documentRepository;

    @Autowired
    public DocumentController(DocumentRepository repo) {
        super(repo);
        this.documentRepository = repo;
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
    List getAllByUserId(@PathVariable Integer id) {
        List<Document> documents = documentRepository.getAllByMeetingId(id);
        return new ArrayList<>(documents);
    }
}