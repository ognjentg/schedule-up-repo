package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Document;
import ba.telegroup.schedule_up.repository.DocumentRepository;
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

    public DocumentController(JpaRepository<Document, Integer> repo) {
        super(repo);
    }

    @RequestMapping(value = "/getById/{id}", method = RequestMethod.GET)
    public @ResponseBody
    Document getById(@PathVariable Integer id) {
        Document document = ((DocumentRepository) repo).getById(id);
        return document;
    }


    @RequestMapping(value = "/getAllByIdIsAfter/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<Document> getAllByIdIsAfter(@PathVariable Integer id) {
        return ((DocumentRepository) repo).getAllByIdIsAfter(id);
    }

    @RequestMapping(value = "/getAllByIdIsBefore/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<Document> getAllByIdIsBefore(@PathVariable Integer id) {
        return ((DocumentRepository) repo).getAllByIdIsBefore(id);
    }

    @RequestMapping(value = "/getAllByNameContains/{name}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByNameContains(@PathVariable String name) {
        List<Document> documents = ((DocumentRepository) repo).getAllByNameContains(name);
        List<Document> result = new ArrayList<>();
        for (Document n : documents) {
            result.add(n);
        }
        return result;
    }

    @RequestMapping(value = "/getAllByMeetingId/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByUserId(@PathVariable Integer id) {
        List<Document> documents = ((DocumentRepository) repo).getAllByMeetingId(id);
        List<Document> result = new ArrayList<>();
        for (Document n : documents) {
            result.add(n);
        }
        return result;
    }
}